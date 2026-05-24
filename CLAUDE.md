@AGENTS.md

# S&OP Copilot — Project Context

## What This Is
S&OP Copilot is a SaaS product that runs every Sunday at 11 PM, pulls supply chain data from SAP/Zoho/Excel, generates an AI briefing pack using Claude API, and emails it to the team before Monday 6 AM. Built for UAE/GCC manufacturers in JAFZA/DAFZA (200–500 employees). Price: AED 7,500/month.

## Live URLs
- **Production:** https://sop-copilot.vercel.app
- **GitHub:** https://github.com/bhadanivinayak/sop-copilot
- **Supabase:** https://supabase.com/dashboard/project/moorteavscmbmzjxwmpj
- **Vercel:** https://vercel.com/bhadanivinayaks-projects/sop-copilot

## Stack
- Next.js 16.2.6 (App Router, Turbopack) — see AGENTS.md for breaking changes
- TypeScript, TailwindCSS v4, shadcn/ui
- Supabase (PostgreSQL + Auth + RLS) — project ref: `moorteavscmbmzjxwmpj`
- Claude API (`claude-sonnet-4-6`) for AI briefing generation
- Resend for transactional email
- Vercel for deployment (auto-deploys on push to `main`)

## Critical: Next.js 16 Breaking Changes
- `middleware.ts` → renamed to `proxy.ts`, exported function must be named `proxy`
- `cookies()` must be `await`ed in server components
- shadcn `Select.onValueChange` type is `(value: string | null) => void`

## Supabase Setup
- **URL:** `https://moorteavscmbmzjxwmpj.supabase.co`
- **Anon key:** in `.env.local` (never commit this file)
- **Migration:** `supabase/migrations/001_initial.sql` — already run in production Supabase
- **Auth bypass:** When `NEXT_PUBLIC_SUPABASE_URL` is not a real URL, `proxy.ts` and login/signup skip auth (demo mode)

## Database Tables
```
companies, profiles (auto-created on signup via trigger)
data_sources, sop_schedules, sop_packs, action_items
gcc_events (17 events pre-seeded 2025–2027)
products, sales_history, event_forecasts
```
All tables have Row Level Security. Users only see their company's data via `get_user_company_id()`.

## Pages Built
- `/login` — Split-screen dark UI with animated briefing card preview
- `/signup` — Company + user registration → creates profile + company rows
- `/dashboard` — KPIs (12 packs, 7 actions, 3 at risk, 84% accuracy), GCC event countdown, action items
- `/sop` — Two-panel: pack list (left) + AI briefing viewer with 4 tabs (Executive Summary, Sales Review, Inventory, Decisions & Actions)
- `/connectors` — Data source management (Excel upload, Zoho, SAP B1, Google Sheets)
- `/settings` — Company config, S&OP schedule, alert thresholds, billing

## What's Working
- [x] All UI pages with mock data
- [x] Real Supabase auth (sign up / login / session management)
- [x] Database schema with RLS
- [x] Demo mode bypass (works without Supabase credentials)
- [x] Deployed on Vercel — auto-deploys on git push

## What's NOT Built Yet (Next Steps in Order)
1. `/api/sop/generate` — POST endpoint: takes company_id, calls Claude API, saves sop_pack row, returns briefing JSON
2. Excel/CSV parser — `xlsx` library → parse uploaded file → insert rows into `sales_history`
3. Resend email — send sop_pack PDF/HTML to attendee_emails on schedule
4. Real connector sync — Zoho Inventory API, SAP B1 connector
5. Cron job — weekly trigger at Sunday 11 PM UAE (04:00 UTC Sunday = Monday 04:00 UTC... wait, UAE is UTC+4, so Sunday 11 PM UAE = Sunday 19:00 UTC)

## Key Files
```
src/proxy.ts                          — auth gate (replaces middleware.ts)
src/lib/supabase/client.ts            — browser Supabase client with isSupabaseConfigured guard
src/lib/supabase/server.ts            — server Supabase client (await cookies())
src/lib/supabase/types.ts             — full TypeScript DB types
src/app/(auth)/login/page.tsx         — premium split-screen login
src/app/(auth)/signup/page.tsx        — company onboarding signup
src/app/(dashboard)/sop/page.tsx      — S&OP pack viewer
src/app/globals.css                   — includes sm-* animation classes
supabase/migrations/001_initial.sql   — full DB schema (already run)
```

## Obsidian Vault Notes
Full project documentation at: `/Users/vinayakbhadani/vault/projects/supplymind/`
- `SupplyMind Overview.md` — master index
- `S&OP Copilot.md` — product detail
- `SupplyMind Dev Log.md` — session changelog (update after each session via /tldr)

## After Every Coding Session
Run `/tldr` to append a new entry to the Dev Log in the Obsidian vault.
