-- =======================================================
-- SUPABASE DATABASE SCHEMA SCRIPT
-- Copy and run this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- =======================================================

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------
-- 1. PROFILES TABLE
-- Synchronizes with the AppContext UserProfile structure
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_tier TEXT DEFAULT 'none' CHECK (subscription_tier IN ('monthly', 'yearly', 'none')),
  subscription_expiry TIMESTAMPTZ,
  subscription_plan TEXT DEFAULT 'none',
  subscription_activation_date TIMESTAMPTZ,
  payment_reference TEXT,
  fitness_goals TEXT,
  weight NUMERIC,
  height NUMERIC,
  target_weight NUMERIC,
  gender TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  age INTEGER,
  activity_level TEXT,
  workout_experience TEXT,
  workout_preference TEXT,
  dietary_preference TEXT,
  available_days INTEGER,
  training_location TEXT,
  available_equipment TEXT,
  food_allergies TEXT,
  health_restrictions TEXT,
  daily_schedule TEXT,
  wake_up_time TEXT,
  bed_time TEXT,
  country_region TEXT,
  water_goal INTEGER DEFAULT 2500,
  water_intake_today INTEGER DEFAULT 0,
  water_last_logged TEXT,
  status TEXT DEFAULT 'active',
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_uid ON public.profiles(uid);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security Policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Allow full access to individual users" ON public.profiles;
CREATE POLICY "Allow full access to individual users" 
  ON public.profiles FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Automatically update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------
-- 2. TODOS TABLE
-- Real-time synchronized Todos table across Supabase and Firebase
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write access to todos" ON public.todos;
CREATE POLICY "Allow public read/write access to todos" 
  ON public.todos FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Enable Supabase Realtime Publication for 'todos'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'todos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
  END IF;
END $$;


-- -------------------------------------------------------
-- 3. EXERCISE MEDIA TABLE
-- Permanent media storage records across Supabase and Firebase
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercise_media (
  exercise_id TEXT PRIMARY KEY,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  original_payload TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on exercise_media
ALTER TABLE public.exercise_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write access to exercise_media" ON public.exercise_media;
CREATE POLICY "Allow public read/write access to exercise_media" 
  ON public.exercise_media FOR ALL 
  USING (true) 
  WITH CHECK (true);

