import { getSession } from 'next-auth/react'
import { google } from 'googleapis'

async function getOAuthClient(session) {
  const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
  oAuth2Client.setCredentials({ access_token: session.accessToken })
  return oAuth2Client
}

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const { hotel = 'güle cunda', sheet = 'Expenses', values } = req.body
  if (!values || !Array.isArray(values)) return res.status(400).json({ error: 'values required' })

  try {
    const auth = await getOAuthClient(session)
    const sheets = google.sheets({ version: 'v4', auth })
    // ensure spreadsheet exists
    const drive = google.drive({ version: 'v3', auth })
    const search = await drive.files.list({
      q: `name='${hotel}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      fields: 'files(id,name)'
    })
    let spreadsheetId
    if (search.data.files.length) spreadsheetId = search.data.files[0].id
    else {
      const create = await sheets.spreadsheets.create({
        requestBody: { properties: { title: hotel }, sheets: [{ properties: { title: 'Expenses' } }, { properties: { title: 'Income' } }] }
      })
      spreadsheetId = create.data.spreadsheetId
    }

    const range = `${sheet}!A1`
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] }
    })
    return res.status(200).json({ ok: true, spreadsheetId })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
