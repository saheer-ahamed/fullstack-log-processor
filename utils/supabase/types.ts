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
      user_preferences: {
        Row: {
          user_id: string
          dashboard_settings: Json
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          dashboard_settings?: Json
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          dashboard_settings?: Json
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      log_files: {
        Row: {
          id: string
          user_id: string
          filename: string
          size_bytes: number
          status: string
          storage_path: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          size_bytes: number
          status?: string
          storage_path: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          size_bytes?: number
          status?: string
          storage_path?: string
          created_at?: string
          updated_at?: string
        }
      }
      processing_jobs: {
        Row: {
          id: string
          file_id: string
          job_id: string
          status: string
          progress: number
          error: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          job_id: string
          status?: string
          progress?: number
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          job_id?: string
          status?: string
          progress?: number
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
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
      realtime_subscriptions: {
        Row: {
          id: string
          user_id: string
          job_ids: string[]
          last_connected_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_ids?: string[]
          last_connected_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_ids?: string[]
          last_connected_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 