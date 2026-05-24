'use client'

import { Bell, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  title: string
  subtitle?: string
  companyName?: string
}

export function Header({ title, subtitle, companyName }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {companyName && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Building2 className="w-3 h-3" />
            {companyName}
          </div>
        )}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          V
        </div>
      </div>
    </header>
  )
}
