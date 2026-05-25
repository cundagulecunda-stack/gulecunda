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

  const hotelName = (req.query.hotel || 'güle cunda').toString()
  try {
    const auth = await getOAuthClient(session)
    const drive = google.drive({ version: 'v3', auth })
    const search = await drive.files.list({
      q: `name='${hotelName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      fields: 'files(id,name)'
    })
    if (search.data.files.length) return res.status(200).json({ spreadsheetId: search.data.files[0].id })

    // create new spreadsheet
    const sheets = google.sheets({ version: 'v4', auth })
    const create = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: hotelName },
        sheets: [
          { properties: { title: 'Expenses' } },
          { properties: { title: 'Income' } }
        ]
      }
    })
    return res.status(200).json({ spreadsheetId: create.data.spreadsheetId })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
