'use client'

import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Upload, RefreshCw, Link2, FileSpreadsheet, Database, Cloud } from 'lucide-react'
import { toast } from 'sonner'

const connectors = [
  {
    id: 'excel_upload',
    name: 'Excel / CSV Upload',
    description: 'Upload your sales history, inventory, and PO data as Excel or CSV files',
    icon: FileSpreadsheet,
    status: 'connected',
    lastSync: '2 hours ago',
    color: 'green',
    category: 'file',
  },
  {
    id: 'zoho_inventory',
    name: 'Zoho Inventory',
    description: 'Live sync — inventory levels, POs, sales orders, and item master',
    icon: Cloud,
    status: 'disconnected',
    lastSync: null,
    color: 'orange',
    category: 'erp',
  },
  {
    id: 'sap_b1',
    name: 'SAP Business One',
    description: 'Enterprise connector — full S&OP data including production orders and MRP',
    icon: Database,
    status: 'disconnected',
    lastSync: null,
    color: 'blue',
    category: 'erp',
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Connect a Google Sheet as a live data source for sales or inventory',
    icon: FileSpreadsheet,
    status: 'disconnected',
    lastSync: null,
    color: 'green',
    category: 'file',
  },
]

const dataStatus = [
  { label: 'Sales History', records: '2,847 rows', period: 'Jan 2023 – May 2026', status: 'ok' },
  { label: 'Products / SKUs', records: '48 products', period: 'Active', status: 'ok' },
  { label: 'Inventory Levels', records: '48 SKUs', period: 'As of today', status: 'ok' },
  { label: 'Purchase Orders', records: '12 open POs', period: 'Current', status: 'warning' },
  { label: 'Production Plan', records: 'Not connected', period: '—', status: 'missing' },
]

export default function ConnectorsPage() {
  function handleConnect(name: string) {
    if (name === 'Excel / CSV Upload') {
      document.getElementById('file-input')?.click()
    } else {
      toast.info(`${name} integration coming soon. Email us to request early access.`)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Connectors" subtitle="Connect your data sources to power S&OP Copilot and Event Surge Planner" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <input id="file-input" type="file" accept=".xlsx,.xls,.csv" className="hidden"
          onChange={() => toast.success('File uploaded — processing data...')} />

        {/* Data status */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Data Coverage Status</CardTitle>
            <CardDescription className="text-xs">What SupplyMind can see right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dataStatus.map(d => (
                <div key={d.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  {d.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : d.status === 'warning' ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{d.label}</p>
                    <p className="text-xs text-slate-500">{d.records} · {d.period}</p>
                  </div>
                  {d.status === 'missing' && (
                    <Badge className="text-[10px] bg-slate-100 text-slate-500">Missing</Badge>
                  )}
                  {d.status === 'warning' && (
                    <Badge className="text-[10px] bg-amber-100 text-amber-700">Partial</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connector cards */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Available Connectors</h3>
          <div className="grid grid-cols-2 gap-4">
            {connectors.map(c => (
              <Card key={c.id} className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-slate-900">{c.name}</h4>
                        {c.status === 'connected' ? (
                          <Badge className="text-[9px] bg-green-100 text-green-700">Connected</Badge>
                        ) : (
                          <Badge className="text-[9px] bg-slate-100 text-slate-500">Not connected</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{c.description}</p>
                      {c.lastSync && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-3">
                          <RefreshCw className="w-3 h-3" /> Last synced {c.lastSync}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {c.status === 'connected' ? (
                          <>
                            <Button size="sm" variant="outline" className="text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" /> Sync Now
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs text-red-500 hover:text-red-600">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleConnect(c.name)}
                          >
                            <Link2 className="w-3 h-3 mr-1" />
                            {c.category === 'file' ? 'Upload File' : 'Connect'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Manual upload CTA */}
        <Card className="border-dashed border-blue-300 bg-blue-50">
          <CardContent className="p-5 flex items-center gap-4">
            <Upload className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Upload your data now to get started</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Export sales history from your current system as Excel/CSV. SupplyMind accepts any format and normalises it automatically.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={() => document.getElementById('file-input')?.click()}>
              <Upload className="w-4 h-4 mr-2" /> Upload Excel / CSV
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
