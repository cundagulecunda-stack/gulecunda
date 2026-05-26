import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'

const PREDEFINED_EXPENSES = [
  { id: 1, name: 'Personel Giderleri', icon: '👥', color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Elektrik', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
  { id: 3, name: 'Su', icon: '💧', color: 'from-cyan-500 to-cyan-600' },
  { id: 4, name: 'Gaz', icon: '🔥', color: 'from-orange-500 to-orange-600' },
  { id: 5, name: 'Temizlik', icon: '🧹', color: 'from-green-500 to-green-600' },
  { id: 6, name: 'Bakım & Onarım', icon: '🔧', color: 'from-gray-500 to-gray-600' },
  { id: 7, name: 'Yemek & İçecek', icon: '🍽️', color: 'from-red-500 to-red-600' },
  { id: 8, name: 'Kamu Giderleri', icon: '📋', color: 'from-purple-500 to-purple-600' },
]

export default function Expenses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [customExpenses, setCustomExpenses] = useState([])
  const [newCustomName, setNewCustomName] = useState('')
  const [selectedExpenses, setSelectedExpenses] = useState({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    // Load custom expenses from localStorage
    const stored = localStorage.getItem('customExpenses')
    if (stored) {
      setCustomExpenses(JSON.parse(stored))
    }
  }, [status, router])

  const handleExpenseChange = (expenseId, amount) => {
    setSelectedExpenses(prev => ({
      ...prev,
      [expenseId]: amount ? parseFloat(amount) : 0
    }))
  }

  const handleAddCustomExpense = () => {
    if (newCustomName.trim()) {
      const newId = `custom_${Date.now()}`
      const newExpense = {
        id: newId,
        name: newCustomName,
        icon: '💰',
        color: 'from-pink-500 to-pink-600'
      }
      const updated = [...customExpenses, newExpense]
      setCustomExpenses(updated)
      localStorage.setItem('customExpenses', JSON.stringify(updated))
      setNewCustomName('')
    }
  }

  const handleRemoveCustomExpense = (id) => {
    const updated = customExpenses.filter(e => e.id !== id)
    setCustomExpenses(updated)
    localStorage.setItem('customExpenses', JSON.stringify(updated))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const expenseRecords = Object.entries(selectedExpenses)
        .filter(([_, amount]) => amount > 0)
        .map(([expenseId, amount]) => {
          const expense = [...PREDEFINED_EXPENSES, ...customExpenses].find(e => e.id.toString() === expenseId.toString())
          return {
            name: expense?.name || 'Unknown',
            amount,
            date
          }
        })

      if (expenseRecords.length === 0) {
        alert('Lütfen en az bir gider ekleyin')
        setLoading(false)
        return
      }

      const response = await fetch('/api/sheets/addExpense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session.user.email,
          expenseRecords,
          date
        })
      })

      if (response.ok) {
        setSaved(true)
        setSelectedExpenses({})
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Giderler kaydedilirken hata oluştu')
      }
    } catch (error) {
      console.error(error)
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
  if (!session) return null

  const allExpenses = [...PREDEFINED_EXPENSES, ...customExpenses]
  const totalAmount = Object.values(selectedExpenses).reduce((sum, val) => sum + (val || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Günlük Giderler</h1>
          <span className="text-sm text-neutral-600">{session.user.email}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Date Picker */}
        <div className="mb-8 animate-fadeIn">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>

        {/* Predefined Expenses */}
        <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold text-black mb-4">Standart Giderler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREDEFINED_EXPENSES.map((expense, idx) => (
              <div
                key={expense.id}
                className="animate-slideUp"
                style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
              >
                <div className={`bg-gradient-to-br ${expense.color} rounded-2xl p-4 mb-2 transition-transform hover:scale-105`}>
                  <div className="text-3xl mb-2">{expense.icon}</div>
                  <p className="text-white text-sm font-medium">{expense.name}</p>
                </div>
                <input
                  type="number"
                  placeholder="₺"
                  min="0"
                  step="0.01"
                  value={selectedExpenses[expense.id] || ''}
                  onChange={(e) => handleExpenseChange(expense.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-center focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Expenses Section */}
        <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold text-black mb-4">Özel Giderler</h2>

          {/* Add Custom Expense */}
          <div className="mb-6 p-4 bg-white rounded-2xl border border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Yeni gider adı (örn: Pazarlık)"
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomExpense()}
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
              <button
                onClick={handleAddCustomExpense}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-all active:scale-95"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Custom Expense List */}
          {customExpenses.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {customExpenses.map((expense, idx) => (
                <div key={expense.id} className="animate-slideUp" style={{ animationDelay: `${0.2 + idx * 0.05}s` }}>
                  <div className={`bg-gradient-to-br ${expense.color} rounded-2xl p-4 mb-2 relative group transition-transform hover:scale-105`}>
                    <div className="text-3xl mb-2">{expense.icon}</div>
                    <p className="text-white text-sm font-medium">{expense.name}</p>
                    <button
                      onClick={() => handleRemoveCustomExpense(expense.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="₺"
                    min="0"
                    step="0.01"
                    value={selectedExpenses[expense.id] || ''}
                    onChange={(e) => handleExpenseChange(expense.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-center focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="mb-8 p-6 bg-white rounded-2xl border border-neutral-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-neutral-700">Toplam Gider</span>
            <span className="text-3xl font-bold text-black">₺ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={handleSave}
            disabled={loading || totalAmount === 0}
            className="flex-1 px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {loading ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Giderleri Kaydet'}
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-4 border border-neutral-300 text-black rounded-xl hover:bg-neutral-50 transition-all"
          >
            Geri
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
