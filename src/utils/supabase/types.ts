export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      log_stats: {
        Row: {
          id: string
          job_id: string
          total_lines: number
          errors_count: number
          warnings_count: number
          keywords_found: Json
          ip_addresses: Json
          error_types: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          total_lines?: number
          errors_count?: number
          warnings_count?: number
          keywords_found?: Json
          ip_addresses?: Json
          error_types?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          total_lines?: number
          errors_count?: number
          warnings_count?: number
          keywords_found?: Json
          ip_addresses?: Json
          error_types?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 