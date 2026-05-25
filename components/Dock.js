import Link from 'next/link'
import Image from 'next/image'

export default function Dock() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="backdrop-blur-md bg-white/60 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
        <Link href="/expenses"><a className="flex flex-col items-center text-sm">
          <Image src="/icons/expense.svg" alt="Gider" width={40} height={40} />
          <span>Gider</span>
        </a></Link>
        <Link href="/income"><a className="flex flex-col items-center text-sm">
          <Image src="/icons/income.svg" alt="Gelir" width={40} height={40} />
          <span>Gelir</span>
        </a></Link>
        <Link href="/reports"><a className="flex flex-col items-center text-sm">
          <Image src="/icons/reports.svg" alt="Rapor" width={40} height={40} />
          <span>Rapor</span>
        </a></Link>
      </div>
    </div>
  )
}
