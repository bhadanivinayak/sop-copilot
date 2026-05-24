'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Brain, LayoutDashboard, CalendarClock, Plug, Settings, LogOut, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sop', label: 'S&OP Copilot', icon: CalendarClock, badge: 'AI' },
  { href: '/connectors', label: 'Connectors', icon: Plug },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-slate-900 border-r border-slate-800 h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-base">S&OP Copilot</span>
          <p className="text-slate-500 text-[10px] leading-none mt-0.5">by SupplyMind</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
              active ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
              {active && <ChevronRight className="w-3 h-3 text-blue-400" />}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
