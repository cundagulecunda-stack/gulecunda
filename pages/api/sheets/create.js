import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session || !session.accessToken) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties: { title: `gulecunda - ${session.user.email} - records` } })
    })

    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
