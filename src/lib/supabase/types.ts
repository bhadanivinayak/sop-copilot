export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          size: string | null
          country: string
          logo_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          company_id: string | null
          full_name: string | null
          role: 'admin' | 'manager' | 'viewer'
          avatar_url: string | null
          onboarded: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      data_sources: {
        Row: {
          id: string
          company_id: string
          type: 'excel_upload' | 'zoho_inventory' | 'sap_b1' | 'google_sheets' | 'csv_upload'
          name: string
          status: 'connected' | 'disconnected' | 'error' | 'syncing'
          last_sync: string | null
          config: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['data_sources']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['data_sources']['Insert']>
      }
      sop_packs: {
        Row: {
          id: string
          company_id: string
          schedule_id: string | null
          title: string
          meeting_date: string | null
          status: 'generating' | 'ready' | 'sent' | 'error'
          pack_data: Json
          ai_summary: string | null
          key_decisions: string[] | null
          risks: string[] | null
          pdf_url: string | null
          generated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sop_packs']['Row'], 'id' | 'generated_at'>
        Update: Partial<Database['public']['Tables']['sop_packs']['Insert']>
      }
      action_items: {
        Row: {
          id: string
          pack_id: string | null
          company_id: string
          description: string
          owner: string | null
          due_date: string | null
          status: 'open' | 'in_progress' | 'done' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['action_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['action_items']['Insert']>
      }
      gcc_events: {
        Row: {
          id: string
          name: string
          type: 'ramadan' | 'eid_fitr' | 'eid_adha' | 'dsf' | 'white_friday' | 'national_day' | 'other'
          start_date: string
          end_date: string
          year: number
          country: string
          typical_surge_multiplier: number
          pre_event_days: number
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['gcc_events']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['gcc_events']['Insert']>
      }
      products: {
        Row: {
          id: string
          company_id: string
          sku: string
          name: string
          category: string | null
          sub_category: string | null
          lead_time_days: number
          current_stock: number
          reorder_point: number
          unit_cost: number | null
          unit_price: number | null
          supplier_name: string | null
          supplier_country: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      sales_history: {
        Row: {
          id: string
          company_id: string
          product_id: string | null
          date: string
          quantity: number
          revenue: number | null
          channel: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sales_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sales_history']['Insert']>
      }
      event_forecasts: {
        Row: {
          id: string
          company_id: string
          product_id: string | null
          event_id: string | null
          predicted_quantity: number | null
          confidence_lower: number | null
          confidence_upper: number | null
          recommended_order_date: string | null
          recommended_order_quantity: number | null
          surge_multiplier: number | null
          ai_reasoning: string | null
          risk_level: 'low' | 'medium' | 'high' | 'critical'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['event_forecasts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['event_forecasts']['Insert']>
      }
    }
  }
}

export type Company = Database['public']['Tables']['companies']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type DataSource = Database['public']['Tables']['data_sources']['Row']
export type SopPack = Database['public']['Tables']['sop_packs']['Row']
export type ActionItem = Database['public']['Tables']['action_items']['Row']
export type GccEvent = Database['public']['Tables']['gcc_events']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type SalesHistory = Database['public']['Tables']['sales_history']['Row']
export type EventForecast = Database['public']['Tables']['event_forecasts']['Row']
