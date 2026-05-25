import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Dock from '../components/Dock'

function TodayDate() {
  const d = new Date()
  return d.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
      <Head>
        <title>güle cunda — Hoş geldiniz</title>
        <meta name="description" content="güle cunda otel yönetim" />
      </Head>

      <main className="w-full max-w-3xl p-8 text-center">
        <div className="mx-auto w-48 h-48 rounded-3xl flex items-center justify-center bg-white shadow-2xl">
          <Image src="/logo.svg" alt="güle cunda" width={160} height={160} />
        </div>

        <h1 className="mt-8 text-4xl font-semibold">güle cunda</h1>
        <p className="mt-2 text-gray-600">Apple tarzı modern arayüz — otel yönetim paneli</p>

        {!session && (
          <div className="mt-8">
            <button onClick={() => signIn('google')} className="px-5 py-3 bg-black text-white rounded-full">Google ile Giriş Yap</button>
          </div>
        )}

        {session && (
          <div className="mt-8">
            <p className="text-gray-700">{TodayDate()}</p>
            <p className="mt-4">Hoş geldin, <strong>{session.user.name}</strong></p>
            <div className="mt-4 flex gap-3 justify-center">
              <button onClick={() => signOut()} className="px-4 py-2 border rounded-md">Çıkış</button>
            </div>
          </div>
        )}
      </main>

      <Dock />
    </div>
  )
}
