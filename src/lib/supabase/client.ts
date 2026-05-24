import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const isSupabaseConfigured = !!url?.startsWith('http') && !!key && key.length > 10

export function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isSupabaseConfigured) return null as any
  return createBrowserClient<Database>(url!, key!)
}
