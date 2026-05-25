import { useSession } from 'next-auth/react'

export default function Reports(){
  const { data: session } = useSession()
  if (!session) return <p className="container">Giriş gerekli.</p>

  return (
    <div className="container">
      <div className="card">
        <h3>Raporlar (ilk sürüm)</h3>
        <p className="muted">Burada günlük / haftalık / aylık gelir-gider özetleri ve dağılım görünecek. İlerleyen adımlarda detaylı grafikler ve profesyonel hesaplamalar eklenecek.</p>
      </div>
    </div>
  )
}
