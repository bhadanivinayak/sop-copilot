'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  CalendarClock, Zap, FileText, CheckCircle2, Clock,
  AlertTriangle, TrendingUp, TrendingDown, Package,
  Users, Download, Send, Plus, ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'

const mockPacks = [
  { id: '1', title: 'S&OP Pack — Week 22, 2026', date: 'Mon May 25, 2026', status: 'ready', decisions: 3, actions: 5, risks: 2 },
  { id: '2', title: 'S&OP Pack — Week 21, 2026', date: 'Mon May 18, 2026', status: 'sent', decisions: 4, actions: 7, risks: 1 },
  { id: '3', title: 'S&OP Pack — Week 20, 2026', date: 'Mon May 11, 2026', status: 'sent', decisions: 2, actions: 3, risks: 3 },
]

const mockPackContent = {
  executiveSummary: `This week's S&OP review highlights critical supply constraints ahead of Eid al-Adha (May 27). Sales are tracking 18% above forecast for fragrance category. Three SKUs are below safety stock. Procurement must confirm PO status for China suppliers before Friday EOD.`,

  salesReview: [
    { category: 'Fragrances', actual: 2840, forecast: 2400, variance: '+18.3%', trend: 'up' },
    { category: 'Personal Care', actual: 1520, forecast: 1600, variance: '-5.0%', trend: 'down' },
    { category: 'Home Fragrance', actual: 890, forecast: 750, variance: '+18.7%', trend: 'up' },
    { category: 'Gift Sets', actual: 340, forecast: 200, variance: '+70.0%', trend: 'up' },
  ],

  inventoryAlerts: [
    { sku: 'FR-0042', name: 'Oud Royal 100ml', doc: 4, reorderPoint: 7, status: 'critical' },
    { sku: 'FR-0078', name: 'Rose Musk 50ml', doc: 6, reorderPoint: 7, status: 'warning' },
    { sku: 'HC-0015', name: 'Bakhoor Classic 250g', doc: 5, reorderPoint: 10, status: 'critical' },
  ],

  keyDecisions: [
    'APPROVE emergency PO for Oud Royal 100ml (FR-0042) — AED 84,000 — due today',
    'CONFIRM Eid al-Adha promotional pricing with Sales team by Wed May 27',
    'DECIDE on Gift Set reorder: delay until post-Eid or accelerate for White Friday?',
  ],

  risks: [
    { text: 'China supplier lead times extended to 68 days (was 35 days)', level: 'high' },
    { text: 'Eid demand forecast uncertainty ±25% — model confidence low', level: 'medium' },
  ],

  actionItems: [
    { text: 'Place emergency PO — FR-0042 Oud Royal', owner: 'Vinayak', due: 'Today', status: 'open' },
    { text: 'Confirm Eid pricing sheet with Sales Director', owner: 'Sales Team', due: 'May 27', status: 'open' },
    { text: 'Update lead times in system for 3 China suppliers', owner: 'Procurement', due: 'Jun 1', status: 'in_progress' },
    { text: 'Run White Friday demand forecast (HC category)', owner: 'Vinayak', due: 'Jun 3', status: 'open' },
    { text: 'Review safety stock levels post-Eid', owner: 'Supply Team', due: 'Jun 10', status: 'open' },
  ],
}

export default function SopPage() {
  const [generating, setGenerating] = useState(false)
  const [selectedPack, setSelectedPack] = useState(mockPacks[0].id)

  async function handleGenerate() {
    setGenerating(true)
    toast.loading('AI is generating your S&OP pack...', { id: 'gen' })
    await new Promise(r => setTimeout(r, 2500))
    toast.success('S&OP pack ready!', { id: 'gen' })
    setGenerating(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="S&OP Copilot"
        subtitle="AI-generated Sales & Operations Planning briefing packs"
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Left: pack list */}
        <div className="w-72 border-r border-slate-200 flex flex-col bg-white overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Now'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockPacks.map(pack => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPack === pack.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 truncate">Week 22, 2026</span>
                  <Badge
                    className={`text-[9px] ${pack.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {pack.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">{pack.date}</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-[10px] text-slate-400">{pack.decisions} decisions</span>
                  <span className="text-[10px] text-slate-400">{pack.actions} actions</span>
                  {pack.risks > 0 && (
                    <span className="text-[10px] text-red-500">{pack.risks} risks</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              Auto-generates every Sunday at 11 PM
            </p>
          </div>
        </div>

        {/* Right: pack viewer */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-3xl mx-auto p-6 space-y-5">

            {/* Pack header */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">S&OP Briefing Pack</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Week 22 — May 25, 2026</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Generated Sunday May 24 at 11:02 PM · <span className="text-green-600 font-medium">Ready for Monday 8 AM meeting</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" /> PDF
                  </Button>
                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-3 h-3 mr-1" /> Email Team
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="bg-white border border-slate-200">
                <TabsTrigger value="summary">Executive Summary</TabsTrigger>
                <TabsTrigger value="sales">Sales Review</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="decisions">Decisions & Actions</TabsTrigger>
              </TabsList>

              {/* Executive Summary */}
              <TabsContent value="summary" className="space-y-4 mt-4">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">AI Executive Summary</CardTitle>
                    <CardDescription className="text-xs">Generated by Claude · Based on live data from your connectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 leading-relaxed">{mockPackContent.executiveSummary}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  {/* Key decisions */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" /> Decisions Needed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockPackContent.keyDecisions.map((d, i) => (
                        <div key={i} className="flex gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-xs text-slate-700">{d}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  <Card className="border-red-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" /> Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockPackContent.risks.map((r, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${r.level === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                          <p className="text-xs text-slate-700">{r.text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sales Review */}
              <TabsContent value="sales" className="mt-4">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Sales Actuals vs Forecast — Last 4 Weeks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left text-xs font-semibold text-slate-500 pb-2">Category</th>
                          <th className="text-right text-xs font-semibold text-slate-500 pb-2">Actual Units</th>
                          <th className="text-right text-xs font-semibold text-slate-500 pb-2">Forecast</th>
                          <th className="text-right text-xs font-semibold text-slate-500 pb-2">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPackContent.salesReview.map(row => (
                          <tr key={row.category} className="border-b border-slate-50">
                            <td className="py-2.5 font-medium text-slate-800">{row.category}</td>
                            <td className="py-2.5 text-right text-slate-700">{row.actual.toLocaleString()}</td>
                            <td className="py-2.5 text-right text-slate-500">{row.forecast.toLocaleString()}</td>
                            <td className="py-2.5 text-right">
                              <span className={`flex items-center justify-end gap-1 font-semibold text-xs ${row.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                                {row.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {row.variance}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory */}
              <TabsContent value="inventory" className="mt-4">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-600" /> SKUs Below Safety Stock
                    </CardTitle>
                    <CardDescription className="text-xs text-red-600">
                      3 SKUs need immediate attention before Eid al-Adha
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockPackContent.inventoryAlerts.map(item => (
                      <div key={item.sku} className={`flex items-center gap-4 p-3 rounded-lg border ${item.status === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${item.status === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">{item.doc} days</p>
                          <p className="text-xs text-slate-500">cover (need {item.reorderPoint})</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs shrink-0">
                          Create PO <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Decisions & Actions */}
              <TabsContent value="decisions" className="mt-4 space-y-4">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">Action Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockPackContent.actionItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          item.status === 'open' ? 'bg-amber-400' :
                          item.status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <p className="text-sm text-slate-700 flex-1">{item.text}</p>
                        <span className="text-xs text-slate-500 shrink-0">{item.owner}</span>
                        <span className={`text-xs font-medium shrink-0 ${item.due === 'Today' ? 'text-red-600' : 'text-slate-500'}`}>
                          {item.due}
                        </span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full border-dashed text-slate-500">
                  <Plus className="w-4 h-4 mr-2" /> Add Action Item
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
