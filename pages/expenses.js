import { useSession } from 'next-auth/react'

export default function Expenses() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold">Günlük Giderler</h2>
        <p className="mt-2 text-sm text-gray-600">Tutarları girip kaydedin. (Örnek arayüz)</p>
        {!session && <p className="mt-4">Önce giriş yapın.</p>}
        {session && (
          <div className="mt-4">
            <p>Burada gider formu olacak; kaydetme Google Sheet'e yazılacak.</p>
          </div>
        )}
      </div>
    </div>
  )
}
