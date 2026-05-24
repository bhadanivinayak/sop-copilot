'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    size: '',
  })

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (!isSupabaseConfigured) {
      toast.success('Demo mode — redirecting to dashboard')
      router.push('/dashboard')
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name: form.companyName, industry: form.industry, size: form.size })
        .select()
        .single()

      if (!companyError && company) {
        await supabase
          .from('profiles')
          .update({ company_id: company.id, full_name: form.fullName, onboarded: true })
          .eq('id', data.user.id)
      }
    }

    toast.success('Account created! Redirecting...')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">SupplyMind</span>
      </div>

      <Card className="bg-slate-800 border-slate-700 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Create your account</CardTitle>
          <CardDescription className="text-slate-400">
            Start with S&OP Copilot or Event Surge Planner — free for 30 days
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input
                  placeholder="Vinayak Bhadani"
                  value={form.fullName}
                  onChange={e => updateForm('fullName', e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company</Label>
                <Input
                  placeholder="ACME Trading LLC"
                  value={form.companyName}
                  onChange={e => updateForm('companyName', e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Work Email</Label>
              <Input
                type="email"
                placeholder="you@company.ae"
                value={form.email}
                onChange={e => updateForm('email', e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => updateForm('password', e.target.value)}
                required
                minLength={8}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Industry</Label>
                <Select onValueChange={(v: string | null) => updateForm('industry', v ?? '')}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="fmcg">FMCG / Distribution</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="pharma">Pharma / Healthcare</SelectItem>
                    <SelectItem value="automotive">Automotive Parts</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company Size</Label>
                <Select onValueChange={(v: string | null) => updateForm('size', v ?? '')}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="1-50">1–50 employees</SelectItem>
                    <SelectItem value="50-200">50–200</SelectItem>
                    <SelectItem value="200-500">200–500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Account
            </Button>
            <p className="text-sm text-slate-400 text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
