import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar: string;
          credits: number;
          is_verified: boolean;
          created_at: string;
          last_seen: string;
          allow_random_media: boolean;
          flame_effect: boolean;
          friends_count: number;
          total_likes: number;
          total_dislikes: number;
          total_comments: number;
          days_without_report: number;
        };
        Insert: {
          id: string;
          username: string;
          avatar?: string;
          credits?: number;
          is_verified?: boolean;
          allow_random_media?: boolean;
          flame_effect?: boolean;
        };
        Update: {
          username?: string;
          avatar?: string;
          credits?: number;
          is_verified?: boolean;
          allow_random_media?: boolean;
          flame_effect?: boolean;
          friends_count?: number;
          total_likes?: number;
          total_dislikes?: number;
          total_comments?: number;
          days_without_report?: number;
        };
      };
      confessions: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          category: string;
          has_audio: boolean;
          audio_url?: string;
          likes: number;
          dislikes: number;
          comments: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          category: string;
          has_audio?: boolean;
          audio_url?: string;
        };
        Update: {
          content?: string;
          category?: string;
          likes?: number;
          dislikes?: number;
          comments?: number;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          description: string;
          icon: string;
          color: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          is_active?: boolean;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          name: string;
          description: string;
          creator_id: string;
          is_private: boolean;
          member_count: number;
          allow_media: boolean;
          invite_code: string;
          created_at: string;
        };
        Insert: {
          name: string;
          description: string;
          creator_id: string;
          is_private?: boolean;
          allow_media?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          member_count?: number;
          allow_media?: boolean;
        };
      };
      private_chats: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          last_message: string;
          last_message_at: string;
          user1_muted: boolean;
          user2_muted: boolean;
          created_at: string;
        };
        Insert: {
          user1_id: string;
          user2_id: string;
          last_message?: string;
        };
        Update: {
          last_message?: string;
          last_message_at?: string;
          user1_muted?: boolean;
          user2_muted?: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          user_id: string;
          content: string;
          message_type: 'text' | 'audio' | 'image' | 'video';
          media_url?: string;
          message_color: string;
          likes: number;
          created_at: string;
        };
        Insert: {
          chat_id: string;
          user_id: string;
          content: string;
          message_type?: 'text' | 'audio' | 'image' | 'video';
          media_url?: string;
          message_color?: string;
        };
        Update: {
          content?: string;
          likes?: number;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id?: string;
          content_id?: string;
          content_type: 'confession' | 'message' | 'user' | 'chat_room';
          reason: string;
          description: string;
          status: 'pending' | 'resolved' | 'dismissed';
          created_at: string;
        };
        Insert: {
          reporter_id: string;
          reported_user_id?: string;
          content_id?: string;
          content_type: 'confession' | 'message' | 'user' | 'chat_room';
          reason: string;
          description: string;
        };
        Update: {
          status?: 'pending' | 'resolved' | 'dismissed';
        };
      };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
        };
        Insert: {
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
        };
        Update: {
          status?: 'pending' | 'accepted' | 'blocked';
        };
      };
    };
  };
};