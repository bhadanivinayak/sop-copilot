import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Building2, Mail, Clock, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Settings" subtitle="Configure your company, S&OP schedule, and notifications" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">

        {/* Company */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Company
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Company Name</Label>
                <Input defaultValue="Demo Company LLC" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Industry</Label>
                <Input defaultValue="FMCG / Distribution" className="text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Country</Label>
                <Input defaultValue="UAE" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Company Size</Label>
                <Input defaultValue="200–500 employees" className="text-sm" />
              </div>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        {/* S&OP Schedule */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> S&OP Pack Schedule
            </CardTitle>
            <CardDescription className="text-xs">
              When should SupplyMind auto-generate and send the briefing pack?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-green-800">
                Active — runs every <strong>Sunday at 11:00 PM</strong>, delivers by Monday 6:00 AM
              </p>
              <Badge className="ml-auto bg-green-100 text-green-700 text-[10px]">Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Meeting Day</Label>
                <Input defaultValue="Monday" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Delivery Time</Label>
                <Input defaultValue="06:00 AM UAE" className="text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Attendee Emails (comma separated)</Label>
              <Input defaultValue="vinayak@company.ae, ops@company.ae, supply@company.ae" className="text-sm" />
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Update Schedule</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Alert Thresholds
            </CardTitle>
            <CardDescription className="text-xs">
              When to send critical supply alerts (WhatsApp / Email)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Days of Cover below (critical)', defaultValue: '7' },
              { label: 'Demand forecast deviation above', defaultValue: '20%' },
              { label: 'Days before event to alert', defaultValue: '30' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-4">
                <Label className="text-xs text-slate-600 flex-1">{f.label}</Label>
                <Input defaultValue={f.defaultValue} className="text-sm w-24 text-right" />
              </div>
            ))}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Save Thresholds</Button>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Free Trial — 30 days remaining</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Includes S&OP Copilot + Event Surge Planner for 1 company. AED 7,500/month after trial.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 text-sm">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
