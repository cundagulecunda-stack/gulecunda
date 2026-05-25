import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Expenses() {
  const { data: session } = useSession()
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')

  if (!session) return <p className="container">Giriş gerekli.</p>

  const submit = async (e) => {
    e.preventDefault()
    const values = [date, desc, amount]
    const res = await fetch('/api/sheets/append', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ hotel: 'güle cunda', sheet: 'Expenses', values }) })
    const j = await res.json()
    if (j.ok) router.push('/dashboard')
    else alert('Hata: ' + (j.error||''))
  }

  return (
    <div className="container">
      <div className="card">
        <h3>Günlük Gider Ekle</h3>
        <form onSubmit={submit}>
          <label>Tarih</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <label>Açıklama</label>
          <input value={desc} onChange={e=>setDesc(e.target.value)} />
          <label>Tutar</label>
          <input value={amount} onChange={e=>setAmount(e.target.value)} />
          <div style={{marginTop:12}}>
            <button className="btn" type="submit">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  )
}
