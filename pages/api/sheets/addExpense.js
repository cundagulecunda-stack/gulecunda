import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const session = await getSession({ req })
  if (!session || !session.accessToken) return res.status(401).json({ error: 'Unauthorized' })

  const { userEmail, expenseRecords, date } = req.body

  try {
    // Step 1: Find or create the "güle cunda" spreadsheet
    let spreadsheetId = null

    // Search for existing spreadsheet
    const searchResponse = await fetch('https://www.googleapis.com/drive/v3/files?q=trashed=false+and+name="%C3%B6le%20cunda"+and+mimeType="application/vnd.google-apps.spreadsheet"', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    const searchData = await searchResponse.json()
    if (searchData.files && searchData.files.length > 0) {
      spreadsheetId = searchData.files[0].id
    } else {
      // Create new spreadsheet
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: 'güle cunda' }
        })
      })

      const createData = await createRes.json()
      if (!createRes.ok) return res.status(createRes.status).json(createData)
      spreadsheetId = createData.spreadsheetId
    }

    // Step 2: Ensure "Giderler" sheet exists
    const sheetsRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const sheetsData = await sheetsRes.json()

    let expenseSheetId = null
    for (const sheet of sheetsData.sheets) {
      if (sheet.properties.title === 'Giderler') {
        expenseSheetId = sheet.properties.sheetId
        break
      }
    }

    // If Giderler sheet doesn't exist, create it
    if (expenseSheetId === null) {
      const addSheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Giderler'
                }
              }
            }
          ]
        })
      })

      const addSheetData = await addSheetRes.json()
      if (!addSheetRes.ok) return res.status(addSheetRes.status).json(addSheetData)
      expenseSheetId = addSheetData.replies[0].addSheet.properties.sheetId

      // Add headers
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Giderler!A1:D1?valueInputOption=RAW`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [['Tarih', 'Gider Türü', 'Tutar (₺)', 'Kullanıcı']]
        })
      })
    }

    // Step 3: Append expense records
    const rows = expenseRecords.map(record => [
      date,
      record.name,
      record.amount,
      userEmail
    ])

    const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Giderler!A:D:append?valueInputOption=RAW`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    })

    const appendData = await appendRes.json()
    if (!appendRes.ok) return res.status(appendRes.status).json(appendData)

    res.status(200).json({
      success: true,
      spreadsheetId,
      updatedRows: appendData.updates.updatedRows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
