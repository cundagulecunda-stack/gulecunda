import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session])

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div>
            <h1 style={{margin:0}}>güle cunda</h1>
            <p className="muted">Otel yönetim paneli</p>
          </div>
          <div>
            {!session ? (
              <button className="btn" onClick={() => signIn('google')}>Google ile Giriş</button>
            ) : (
              <button className="btn" onClick={() => signOut()}>Çıkış</button>
            )}
          </div>
        </div>
        <p className="muted">Sadece Google hesabı ile giriş yapılabilir. Başlamak için giriş yapın.</p>
      </div>
    </div>
  )
}
