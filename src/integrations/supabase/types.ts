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
      clients: {
        Row: {
          business_type: string
          contact_name: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          business_type: string
          contact_name: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          business_type?: string
          contact_name?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_services: {
        Row: {
          contract_id: string | null
          created_at: string
          id: string
          price: number
          service_id: string
          service_name: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          id?: string
          price: number
          service_id: string
          service_name: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          id?: string
          price?: number
          service_id?: string
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_services_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_company: string
          company_logo: string | null
          created_at: string
          created_by: string
          id: string
          manual_signature: boolean | null
          signature_data: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          template_id: string
          total_value: number
          updated_at: string
        }
        Insert: {
          client_company: string
          company_logo?: string | null
          created_at?: string
          created_by: string
          id?: string
          manual_signature?: boolean | null
          signature_data?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          template_id: string
          total_value: number
          updated_at?: string
        }
        Update: {
          client_company?: string
          company_logo?: string | null
          created_at?: string
          created_by?: string
          id?: string
          manual_signature?: boolean | null
          signature_data?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          template_id?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          client_id: string
          client_name: string
          conversation_notes: string
          created_at: string
          id: string
          is_ai_generated: boolean
          summary: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name: string
          conversation_notes: string
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          summary: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string
          conversation_notes?: string
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      facebook_ads_credentials: {
        Row: {
          access_token: string
          account_name: string
          ad_account_id: string
          client_name: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_name?: string
          ad_account_id: string
          client_name?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_name?: string
          ad_account_id?: string
          client_name?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_ads_credentials: {
        Row: {
          account_name: string
          client_id: string
          client_name: string | null
          client_secret: string
          created_at: string | null
          customer_id: string
          developer_token: string
          id: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name?: string
          client_id: string
          client_name?: string | null
          client_secret: string
          created_at?: string | null
          customer_id: string
          developer_token: string
          id?: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          client_id?: string
          client_name?: string | null
          client_secret?: string
          created_at?: string | null
          customer_id?: string
          developer_token?: string
          id?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lead_comments: {
        Row: {
          category: string
          comment: string
          created_at: string | null
          id: string
          lead_id: string
          user_id: string
        }
        Insert: {
          category: string
          comment: string
          created_at?: string | null
          id: string
          lead_id: string
          user_id: string
        }
        Update: {
          category?: string
          comment?: string
          created_at?: string | null
          id?: string
          lead_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_comments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ad: string
          ad_set: string
          campaign: string
          created_at: string | null
          date: string
          id: string
          name: string
          phone: string
          source: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ad: string
          ad_set: string
          campaign: string
          created_at?: string | null
          date: string
          id: string
          name: string
          phone: string
          source: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ad?: string
          ad_set?: string
          campaign?: string
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          phone?: string
          source?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contract_status: "draft" | "pending" | "signed" | "expired"
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
