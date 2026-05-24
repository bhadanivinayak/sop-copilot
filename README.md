# S&OP Copilot

> AI-powered Sales & Operations Planning briefing pack generator for UAE/GCC manufacturers.

Built with Next.js 16, Supabase, and Claude AI (Anthropic).

## The Problem

S&OP meetings at UAE manufacturing companies take 3 hours every Monday. 2 of those hours are spent arguing about which number is right — Sales has one Excel, Ops has another, Finance has a third. The meeting produces nothing actionable.

## The Solution

S&OP Copilot runs every Sunday at 11 PM, pulls data from your connected sources (SAP Business One, Zoho Inventory, Excel), and delivers a structured AI briefing pack to your team before Monday's 8 AM meeting.

**What the pack includes:**
- Executive summary (AI-generated)
- Sales actuals vs forecast (last 4 weeks)
- Inventory review — days of cover, SKUs below safety stock
- Supply review — open POs, lead time flags
- Decisions needed (numbered, owner assigned)
- Action items from last meeting

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** Claude API (claude-sonnet-4-6) with prompt caching
- **Styling:** TailwindCSS v4 + shadcn/ui
- **Email:** Resend

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase + Anthropic + Resend keys
npm run dev
```

Run the database migration in your Supabase SQL Editor:
```
supabase/migrations/001_initial.sql
```

## Target Market

UAE/GCC manufacturers and distributors in JAFZA, DAFZA, Dubai Industrial City. 200–500 employees. Using SAP Business One or Zoho Inventory.

**Pricing:** AED 7,500/month (~$2,000)

---
*Built by [Vinayak Bhadani](https://github.com/bhadanivinayak)*
