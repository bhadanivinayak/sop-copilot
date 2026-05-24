'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, TrendingUp, CheckCircle2, Calendar, Zap, ArrowRight } from 'lucide-react'

const briefingItems = [
  { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', text: 'Ramadan in 23 days — 12 SKUs below safety stock threshold' },
  { icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)', text: 'Beverages forecast +34% — increase next PO by 2,400 units' },
  { icon: CheckCircle2, color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.15)', text: 'White Friday demand plan locked — all supplier POs confirmed' },
]

const events = [
  { name: 'Ramadan', surge: '3.5×', days: 23, color: '#f59e0b' },
  { name: 'Eid al-Fitr', surge: '2.5×', days: 53, color: '#34d399' },
  { name: 'DSF 2026', surge: '2.8×', days: 187, color: '#818cf8' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (!isSupabaseConfigured) {
      router.push('/dashboard')
      return
    }
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="sm-orb" style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: -200, left: -150, filter: 'blur(60px)' }} />
        <div className="sm-orb" style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', bottom: -150, right: -100, filter: 'blur(60px)', animationDelay: '3s' }} />
        <div className="sm-orb" style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', top: '35%', left: '40%', filter: 'blur(60px)', animationDelay: '6s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex" style={{ flexDirection: 'column', justifyContent: 'space-between', width: '58%', padding: '48px 56px', position: 'relative', zIndex: 10 }}>
        <div className="sm-fade-up" style={{ animationDelay: '0ms', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>S&OP Copilot</span>
        </div>

        <div style={{ maxWidth: 520 }}>
          <div className="sm-fade-up" style={{ animationDelay: '80ms', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8' }} className="sm-orb" />
            <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 500, letterSpacing: '0.03em' }}>AI-Powered S&OP Intelligence for GCC</span>
          </div>

          <h1 className="sm-fade-up" style={{ animationDelay: '160ms', fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', color: '#fff', marginBottom: 20 }}>
            Your Monday meeting,<br />
            <span className="sm-gradient-text">decided Sunday night.</span>
          </h1>

          <p className="sm-fade-up" style={{ animationDelay: '240ms', fontSize: 17, color: 'rgba(148,163,184,0.85)', lineHeight: 1.65, marginBottom: 36 }}>
            Pulls live data from SAP, Zoho, or Excel every Sunday at 11 PM. AI-generated decision briefing delivered before your Monday 6 AM meeting.
          </p>

          <div className="sm-fade-up sm-float sm-glass" style={{ animationDelay: '320ms', borderRadius: 20, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>S&OP Pack · Week 22 · May 25, 2026</div>
                <div style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>3 decisions needed · 2 risks flagged</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} className="sm-orb" />
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Delivered 5:47 AM</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {briefingItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 12, background: item.bg, border: `1px solid ${item.border}` }}>
                  <item.icon size={14} color={item.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(226,232,240,0.9)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sm-fade-up" style={{ animationDelay: '400ms', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {events.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 12, background: `${ev.color}12`, border: `1px solid ${ev.color}28` }}>
                <Calendar size={12} color={ev.color} />
                <span style={{ fontSize: 12, color: ev.color, fontWeight: 600 }}>{ev.name}</span>
                <span style={{ fontSize: 12, color: `${ev.color}99` }}>·</span>
                <span style={{ fontSize: 12, color: ev.color, fontWeight: 700 }}>{ev.surge}</span>
                <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)' }}>in {ev.days}d</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sm-fade-up" style={{ animationDelay: '480ms', fontSize: 12, color: 'rgba(100,116,139,0.7)', letterSpacing: '0.02em' }}>
          Trusted by manufacturers in JAFZA · DAFZA · Sharjah · Abu Dhabi
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="flex lg:hidden sm-fade-up" style={{ animationDelay: '0ms', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>S&OP Copilot</span>
          </div>

          <div className="sm-fade-up sm-glass-strong" style={{ animationDelay: '120ms', borderRadius: 24, padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.4px' }}>Welcome back</h2>
              <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.7)', lineHeight: 1.5 }}>Sign in to your S&OP command centre</p>
            </div>

            {!isSupabaseConfigured && (
              <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#fbbf24' }}>Demo mode — Supabase not connected.</span>
                <button onClick={() => router.push('/dashboard')} style={{ marginLeft: 'auto', fontSize: 12, color: '#fbbf24', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Explore app →
                </button>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.8)', marginBottom: 8 }}>Work Email</label>
                <input type="email" placeholder="you@company.ae" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required className="sm-input"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, boxSizing: 'border-box', borderColor: focused === 'email' ? 'rgba(99,102,241,0.7)' : undefined, background: focused === 'email' ? 'rgba(99,102,241,0.07)' : undefined, boxShadow: focused === 'email' ? '0 0 0 3px rgba(99,102,241,0.12)' : undefined }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.8)', marginBottom: 8 }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required className="sm-input"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14, boxSizing: 'border-box', borderColor: focused === 'password' ? 'rgba(99,102,241,0.7)' : undefined, background: focused === 'password' ? 'rgba(99,102,241,0.07)' : undefined, boxShadow: focused === 'password' ? '0 0 0 3px rgba(99,102,241,0.12)' : undefined }} />
              </div>
              <button type="submit" disabled={loading} className="sm-btn-primary"
                style={{ width: '100%', padding: '13px 20px', borderRadius: 12, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <><span>Sign In</span><ArrowRight size={15} /></>}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: 'rgba(100,116,139,0.7)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(100,116,139,0.8)' }}>
              No account?{' '}
              <Link href="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Start free trial →</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(71,85,105,0.7)', marginTop: 20 }}>
            30-day free trial · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
