export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          age_range: string[] | null
          claimed_by: string | null
          coordinates: unknown | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_business: boolean | null
          is_verified: boolean | null
          location: string
          opening_hours: string | null
          price_range: string | null
          ticket_url: string | null
          title: string
          type: string[]
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          age_range?: string[] | null
          claimed_by?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_business?: boolean | null
          is_verified?: boolean | null
          location: string
          opening_hours?: string | null
          price_range?: string | null
          ticket_url?: string | null
          title: string
          type: string[]
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          age_range?: string[] | null
          claimed_by?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_business?: boolean | null
          is_verified?: boolean | null
          location?: string
          opening_hours?: string | null
          price_range?: string | null
          ticket_url?: string | null
          title?: string
          type?: string[]
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_name: string
          business_type: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          activity_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          max_participants: number | null
          price: number | null
          start_time: string
          title: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          max_participants?: number | null
          price?: number | null
          start_time: string
          title: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          max_participants?: number | null
          price?: number | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          activity_id: string
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          activity_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          activity_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          activity_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          activity_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          activity_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_needs: string[] | null
          child_age_ranges: string[] | null
          created_at: string | null
          id: string
          interests: string[] | null
          max_distance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string[] | null
          child_age_ranges?: string[] | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          max_distance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string[] | null
          child_age_ranges?: string[] | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          max_distance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          activity_id: string
          caption: string | null
          created_at: string | null
          id: string
          user_id: string
          video_url: string
        }
        Insert: {
          activity_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          video_url: string
        }
        Update: {
          activity_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
