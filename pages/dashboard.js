import { getSession, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(format(new Date(), 'dd MMMM yyyy'))
  }, [])

  if (status === 'loading') return null
  if (!session) return <p className="container">Giriş gerekli.</p>

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div>
            <h2 style={{margin:0}}>Hoş geldin, güle cunda</h2>
            <p className="muted">Bugün: {today}</p>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <Link href="/expenses"><button className="btn" style={{marginRight:12}}>Gider Ekle</button></Link>
          <Link href="/income"><button className="btn">Gelir Ekle</button></Link>
        </div>

        <div style={{marginTop:18}}>
          <Link href="/reports"><a className="muted">Raporlar</a></Link>
        </div>
      </div>
    </div>
  )
}
