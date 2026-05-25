import { useSession } from 'next-auth/react'

export default function Reports() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold">Raporlar</h2>
        <p className="mt-2 text-sm text-gray-600">Günlük/Haftalık/Aylık gelir-gider özetleri burada olacak.</p>
        {!session && <p className="mt-4">Önce giriş yapın.</p>}
      </div>
    </div>
  )
}
