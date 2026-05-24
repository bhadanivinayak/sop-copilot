'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { Loader2, Zap, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react'

const valuePoints = [
  { icon: AlertTriangle, color: '#f59e0b', text: 'Know your Ramadan stockout risk 3 weeks before it happens' },
  { icon: TrendingUp, color: '#34d399', text: 'AI-generated briefing pack ready before Monday 6 AM' },
  { icon: CheckCircle2, color: '#818cf8', text: 'Per-SKU surge forecasts for all GCC events 2025–2027' },
  { icon: BarChart3, color: '#f472b6', text: 'Connect SAP B1, Zoho, or upload Excel — any format' },
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', companyName: '', industry: '', size: '' })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      toast.success('Demo mode — entering dashboard')
      router.push('/dashboard')
      return
    }

    const supabase = createClient() as any

    // 1. Create auth user
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

    // If email confirmation is required, session is null — can't do RLS-protected inserts yet
    if (!data.session) {
      toast.success('Check your email to confirm your account, then sign in.')
      setLoading(false)
      router.push('/login')
      return
    }

    if (data.user) {
      // 2. Create company row
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name: form.companyName, industry: form.industry || null, size: form.size || null })
        .select()
        .single()

      if (companyError) {
        toast.error(`Company setup failed: ${companyError.message}`)
        setLoading(false)
        return
      }

      // 3. Link profile → company
      if (company) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_id: company.id, full_name: form.fullName, onboarded: true })
          .eq('id', data.user.id)

        if (profileError) {
          toast.error(`Profile update failed: ${profileError.message}`)
          setLoading(false)
          return
        }
      }
    }

    toast.success('Account created! Welcome to SupplyMind.')
    router.push('/dashboard')
    router.refresh()
  }

  const inputStyle = (field: string) => ({
    width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 14,
    boxSizing: 'border-box' as const,
    borderColor: focused === field ? 'rgba(99,102,241,0.7)' : undefined,
    background: focused === field ? 'rgba(99,102,241,0.07)' : undefined,
    boxShadow: focused === field ? '0 0 0 3px rgba(99,102,241,0.12)' : undefined,
  })

  const selectStyle = (field: string) => ({
    width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 14,
    appearance: 'none' as const, cursor: 'pointer',
    borderColor: focused === field ? 'rgba(99,102,241,0.7)' : undefined,
    background: focused === field ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.04)',
    boxShadow: focused === field ? '0 0 0 3px rgba(99,102,241,0.12)' : undefined,
    border: `1px solid ${focused === field ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.09)'}`,
    color: form[field as keyof typeof form] ? '#fff' : 'rgba(148,163,184,0.4)',
    outline: 'none',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="sm-orb" style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)', top: -180, left: -120, filter: 'blur(70px)' }} />
        <div className="sm-orb" style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', bottom: -120, right: -80, filter: 'blur(70px)', animationDelay: '4s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex" style={{ flexDirection: 'column', justifyContent: 'space-between', width: '52%', padding: '48px 52px', position: 'relative', zIndex: 10 }}>

        {/* Logo */}
        <div className="sm-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(99,102,241,0.4)' }}>
            <Zap size={17} color="white" />
          </div>
          <span style={{ color: '#fff', fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px' }}>S&OP Copilot</span>
        </div>

        {/* Hero */}
        <div style={{ maxWidth: 460 }}>
          <div className="sm-fade-up" style={{ animationDelay: '80ms', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', marginBottom: 22 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#818cf8' }} className="sm-orb" />
            <span style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 500, letterSpacing: '0.04em' }}>Free 30-day trial · No credit card</span>
          </div>

          <h1 className="sm-fade-up" style={{ animationDelay: '140ms', fontSize: 46, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.4px', color: '#fff', marginBottom: 18 }}>
            Stop running S&OP<br />
            <span className="sm-gradient-text">on spreadsheets.</span>
          </h1>

          <p className="sm-fade-up" style={{ animationDelay: '200ms', fontSize: 16, color: 'rgba(148,163,184,0.8)', lineHeight: 1.65, marginBottom: 36 }}>
            Join UAE manufacturers replacing 3-hour Monday meetings with AI-generated briefing packs. Setup takes 10 minutes.
          </p>

          {/* Value points */}
          <div className="sm-fade-up" style={{ animationDelay: '260ms', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
            {valuePoints.map((pt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${pt.color}15`, border: `1px solid ${pt.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <pt.icon size={13} color={pt.color} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(203,213,225,0.85)', lineHeight: 1.55 }}>{pt.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="sm-fade-up sm-glass" style={{ animationDelay: '320ms', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>V</div>
            <div>
              <p style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500, marginBottom: 2 }}>"Finally a tool that understands Ramadan demand shifts."</p>
              <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)' }}>Vinayak Bhadani · ANDS Trading FZE, JAFZA</p>
            </div>
          </div>
        </div>

        <div className="sm-fade-up" style={{ animationDelay: '380ms', fontSize: 11, color: 'rgba(100,116,139,0.6)', letterSpacing: '0.02em' }}>
          JAFZA · DAFZA · Sharjah · Abu Dhabi · Dubai
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden sm-fade-up" style={{ alignItems: 'center', gap: 9, justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="white" />
            </div>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>S&OP Copilot</span>
          </div>

          <div className="sm-fade-up sm-glass-strong" style={{ animationDelay: '100ms', borderRadius: 24, padding: '32px 30px' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 5, letterSpacing: '-0.4px' }}>Create your account</h2>
              <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.65)' }}>Start with S&OP Copilot or Event Surge Planner — free for 30 days</p>
            </div>

            <form onSubmit={handleSignup}>
              {/* Row 1: Full Name + Company */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Full Name</label>
                  <input type="text" placeholder="Vinayak Bhadani" value={form.fullName} onChange={e => set('fullName', e.target.value)}
                    onFocus={() => setFocused('fullName')} onBlur={() => setFocused(null)} required
                    className="sm-input" style={inputStyle('fullName')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Company</label>
                  <input type="text" placeholder="ACME Trading LLC" value={form.companyName} onChange={e => set('companyName', e.target.value)}
                    onFocus={() => setFocused('companyName')} onBlur={() => setFocused(null)} required
                    className="sm-input" style={inputStyle('companyName')} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Work Email</label>
                <input type="email" placeholder="you@company.ae" value={form.email} onChange={e => set('email', e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required
                  className="sm-input" style={inputStyle('email')} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Password</label>
                <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required minLength={8}
                  className="sm-input" style={inputStyle('password')} />
              </div>

              {/* Row 2: Industry + Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Industry</label>
                  <select value={form.industry} onChange={e => set('industry', e.target.value)}
                    onFocus={() => setFocused('industry')} onBlur={() => setFocused(null)}
                    style={selectStyle('industry')}>
                    <option value="" disabled>Select…</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="fmcg">FMCG / Distribution</option>
                    <option value="retail">Retail</option>
                    <option value="pharma">Pharma / Healthcare</option>
                    <option value="automotive">Automotive Parts</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.75)', marginBottom: 6, letterSpacing: '0.02em' }}>Company Size</label>
                  <select value={form.size} onChange={e => set('size', e.target.value)}
                    onFocus={() => setFocused('size')} onBlur={() => setFocused(null)}
                    style={selectStyle('size')}>
                    <option value="" disabled>Select…</option>
                    <option value="1-50">1–50 employees</option>
                    <option value="50-200">50–200</option>
                    <option value="200-500">200–500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="sm-btn-primary"
                style={{ width: '100%', padding: '13px 20px', borderRadius: 12, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Creating account...</>
                  : <><span>Create Account</span><ArrowRight size={14} /></>}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 11, color: 'rgba(100,116,139,0.7)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(100,116,139,0.8)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(71,85,105,0.65)', marginTop: 16 }}>
            By signing up you agree to our Terms of Service · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
