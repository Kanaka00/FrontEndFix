export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          features: string[];
          category: string;
          status: string;
          technologies: string[];
          image_url: string | null;
          video_url: string | null;
          demo_url: string | null;
          code_url: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          features?: string[];
          category: string;
          status?: string;
          technologies?: string[];
          image_url?: string | null;
          video_url?: string | null;
          demo_url?: string | null;
          code_url?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          features?: string[];
          category?: string;
          status?: string;
          technologies?: string[];
          image_url?: string | null;
          video_url?: string | null;
          demo_url?: string | null;
          code_url?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          image_url: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          image_url?: string | null;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          image_url?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string;
          completed: boolean;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date: string;
          completed?: boolean;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          due_date?: string;
          completed?: boolean;
          created_at?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}