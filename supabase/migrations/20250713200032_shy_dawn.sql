/*
  # Initial Schema for Anonymous Chat App

  1. New Tables
    - `profiles` - User profiles with credits and settings
    - `categories` - Confession categories (work, family, etc.)
    - `confessions` - User confessions with categories
    - `chat_rooms` - Public and private chat rooms
    - `private_chats` - One-on-one conversations
    - `messages` - Chat messages with media support
    - `reports` - User reports for moderation
    - `friendships` - User friend connections

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure user data access

  3. Features
    - Credit system for monetization
    - Media upload support
    - Real-time messaging
    - Moderation system
    - Friend system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar text DEFAULT '😊',
  credits integer DEFAULT 50,
  is_verified boolean DEFAULT false,
  allow_random_media boolean DEFAULT true,
  flame_effect boolean DEFAULT false,
  friends_count integer DEFAULT 0,
  total_likes integer DEFAULT 0,
  total_dislikes integer DEFAULT 0,
  total_comments integer DEFAULT 0,
  days_without_report integer DEFAULT 0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT '📝',
  color text DEFAULT '#8b5cf6',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Confessions table
CREATE TABLE IF NOT EXISTS confessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  has_audio boolean DEFAULT false,
  audio_url text,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_private boolean DEFAULT false,
  member_count integer DEFAULT 0,
  allow_media boolean DEFAULT true,
  invite_code text UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Private chats table
CREATE TABLE IF NOT EXISTS private_chats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  user1_muted boolean DEFAULT false,
  user2_muted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image', 'video')),
  media_url text,
  message_color text DEFAULT '#8b5cf6',
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid,
  content_type text NOT NULL CHECK (content_type IN ('confession', 'message', 'user', 'chat_room')),
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now()
);

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles" ON profiles
  FOR SELECT TO authenticated
  USING (true);

-- Categories policies
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Confessions policies
CREATE POLICY "Anyone can read confessions" ON confessions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create confessions" ON confessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own confessions" ON confessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Chat rooms policies
CREATE POLICY "Anyone can read public chat rooms" ON chat_rooms
  FOR SELECT TO authenticated
  USING (is_private = false OR creator_id = auth.uid());

CREATE POLICY "Users can create chat rooms" ON chat_rooms
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update chat rooms" ON chat_rooms
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id);

-- Private chats policies
CREATE POLICY "Users can read own chats" ON private_chats
  FOR SELECT TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create chats" ON private_chats
  FOR INSERT TO authenticated
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update own chats" ON private_chats
  FOR UPDATE TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read messages in their chats" ON messages
  FOR SELECT TO authenticated
  USING (true); -- Will be refined based on chat membership

CREATE POLICY "Users can create messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can read own reports" ON reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- Friendships policies
CREATE POLICY "Users can read own friendships" ON friendships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own friendships" ON friendships
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Insert default categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('work', 'Work-related confessions and questions', '💼', '#3b82f6'),
  ('relationships', 'Love, dating, and relationship matters', '❤️', '#ef4444'),
  ('family', 'Family issues and stories', '👨‍👩‍👧‍👦', '#22c55e'),
  ('questions', 'Ask anything anonymously', '❓', '#f59e0b'),
  ('secrets', 'Deep personal secrets', '🤫', '#6366f1'),
  ('mental-health', 'Mental health and wellness', '🧠', '#8b5cf6'),
  ('money', 'Financial confessions and advice', '💰', '#10b981'),
  ('school', 'Education and student life', '🎓', '#06b6d4')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_confessions_category ON confessions(category);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confessions_updated_at BEFORE UPDATE ON confessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();