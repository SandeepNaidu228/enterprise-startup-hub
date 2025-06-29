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
      startups: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          industry: string | null
          location: string | null
          website: string | null
          contact_email: string
          contact_phone: string | null
          team_members: Json
          projects: Json
          tags: string[]
          funding_stage: string | null
          team_size: number
          founded_year: number | null
          rating: number
          profile_views: number
          projects_submitted: number
          completed_projects: number
          average_rating: number
          total_ratings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          industry?: string | null
          location?: string | null
          website?: string | null
          contact_email: string
          contact_phone?: string | null
          team_members?: Json
          projects?: Json
          tags?: string[]
          funding_stage?: string | null
          team_size?: number
          founded_year?: number | null
          rating?: number
          profile_views?: number
          projects_submitted?: number
          completed_projects?: number
          average_rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          industry?: string | null
          location?: string | null
          website?: string | null
          contact_email?: string
          contact_phone?: string | null
          team_members?: Json
          projects?: Json
          tags?: string[]
          funding_stage?: string | null
          team_size?: number
          founded_year?: number | null
          rating?: number
          profile_views?: number
          projects_submitted?: number
          completed_projects?: number
          average_rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
      }
      enterprises: {
        Row: {
          id: string
          user_id: string | null
          company_name: string
          contact_person: string
          email: string
          industry: string | null
          company_size: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name: string
          contact_person: string
          email: string
          industry?: string | null
          company_size?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string
          contact_person?: string
          email?: string
          industry?: string | null
          company_size?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_requests: {
        Row: {
          id: string
          enterprise_id: string | null
          startup_id: string | null
          title: string
          description: string
          budget: string | null
          timeline: string | null
          requirements: string[]
          status: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          enterprise_id?: string | null
          startup_id?: string | null
          title: string
          description: string
          budget?: string | null
          timeline?: string | null
          requirements?: string[]
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          enterprise_id?: string | null
          startup_id?: string | null
          title?: string
          description?: string
          budget?: string | null
          timeline?: string | null
          requirements?: string[]
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_recommendations: {
        Row: {
          id: string
          enterprise_id: string | null
          project_description: string
          recommendations: Json
          analysis_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          enterprise_id?: string | null
          project_description: string
          recommendations?: Json
          analysis_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          enterprise_id?: string | null
          project_description?: string
          recommendations?: Json
          analysis_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_profile_views: {
        Args: {
          startup_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}