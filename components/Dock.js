import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dock() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const dockItems = [
    { href: '/expenses', icon: '💰', label: 'Gider' },
    { href: '/income', icon: '📈', label: 'Gelir' },
    { href: '/reports', icon: '📊', label: 'Rapor' },
  ]

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="backdrop-blur-xl bg-white/80 rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl border border-white/20">
        {dockItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className="flex flex-col items-center justify-center w-16 h-16 hover:bg-black/5 rounded-full transition-all active:scale-95">
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
