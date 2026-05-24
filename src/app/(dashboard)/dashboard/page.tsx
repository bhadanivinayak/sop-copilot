import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarClock, Calendar, ArrowRight, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, Package, Zap
} from 'lucide-react'
import Link from 'next/link'

const upcomingEvents = [
  { name: 'Eid al-Adha 2026', date: 'May 27 – May 30', daysLeft: 3, type: 'eid_adha', surge: '2.0×', risk: 'high' },
  { name: 'White Friday UAE 2026', date: 'Nov 27 – Nov 29', daysLeft: 187, type: 'white_friday', surge: '4.0×', risk: 'medium' },
  { name: 'UAE National Day 2026', date: 'Dec 2 – Dec 3', daysLeft: 192, type: 'national_day', surge: '1.5×', risk: 'low' },
  { name: 'Ramadan 2027', date: 'Feb 7 – Mar 8', daysLeft: 259, type: 'ramadan', surge: '3.5×', risk: 'medium' },
]

const riskColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}

const eventIcons: Record<string, string> = {
  eid_adha: '🐑', white_friday: '🛍️', national_day: '🇦🇪', ramadan: '🌙', eid_fitr: '⭐', dsf: '🎪',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Dashboard"
        subtitle="Your supply chain command centre"
        companyName="Demo Company LLC"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Good morning, Vinayak</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Eid al-Adha is in <strong className="text-white">3 days</strong> — check your event forecasts
            </p>
          </div>
          <Link href="/events">
            <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
              View Forecasts <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'S&OP Packs Generated', value: '12', icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Open Action Items', value: '7', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'SKUs at Risk (Event)', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Forecast Accuracy', value: '84%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two column: modules + events */}
        <div className="grid grid-cols-2 gap-6">

          {/* Modules */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Your Modules</h3>

            <Link href="/sop">
              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <CalendarClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">S&OP Copilot</h4>
                        <Badge className="text-[10px] bg-blue-600 text-white">AI</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Auto-generates your Monday S&OP briefing pack from live data — delivered before the meeting.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" /> Last pack: Mon 6:02 AM
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events">
              <Card className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">Event Surge Planner</h4>
                        <Badge className="text-[10px] bg-green-600 text-white">AI</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        GCC event-aware demand forecasting. Ramadan, DSF, Eid — know what to order and when.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3" /> 3 SKUs need attention
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Quick connect */}
            <Link href="/connectors">
              <Card className="border-dashed border-slate-300 hover:border-slate-400 transition-all cursor-pointer">
                <CardContent className="p-5 flex items-center gap-3 text-slate-500">
                  <Zap className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Connect your data</p>
                    <p className="text-xs">Upload Excel, connect SAP B1, Zoho, or Google Sheets</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Upcoming GCC Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Upcoming GCC Events</h3>
              <Link href="/events" className="text-xs text-blue-600 hover:underline">View all →</Link>
            </div>

            <Card className="border-slate-200">
              <CardContent className="p-0">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={event.name}
                    className={`flex items-center gap-4 px-4 py-3.5 ${i < upcomingEvents.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <div className="text-xl w-8 text-center">{eventIcons[event.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.name}</p>
                      <p className="text-xs text-slate-500">{event.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${riskColors[event.risk]}`}>
                        {event.risk === 'high' ? '⚠ ' : ''}{event.risk}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {event.daysLeft}d · {event.surge} surge
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action items preview */}
            <Card className="border-slate-200">
              <CardHeader className="py-3 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Open Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {[
                  { text: 'Place Eid al-Adha PO for fragrance bottles', owner: 'Vinayak', due: 'Today', urgent: true },
                  { text: 'Review SKU-047 forecast for Ramadan 2027', owner: 'Supply Team', due: 'Jun 1', urgent: false },
                  { text: 'Update lead times for China suppliers', owner: 'Procurement', due: 'Jun 3', urgent: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.urgent ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <p className="text-xs text-slate-700 flex-1">{item.text}</p>
                    <span className={`text-[10px] font-medium ${item.urgent ? 'text-red-600' : 'text-slate-500'}`}>
                      {item.due}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
