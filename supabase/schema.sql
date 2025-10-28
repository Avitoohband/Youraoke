-- Youraoke Database Schema
-- This file contains the database schema for the Youraoke application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Singers table
CREATE TABLE IF NOT EXISTS public.singers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    singer_id UUID NOT NULL REFERENCES public.singers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'he')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_singers_user_id ON public.singers(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_singer_id ON public.songs(singer_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on tables
ALTER TABLE public.singers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Singers policies: Users can only access their own singers
CREATE POLICY "Users can view their own singers"
    ON public.singers
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own singers"
    ON public.singers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own singers"
    ON public.singers
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own singers"
    ON public.singers
    FOR DELETE
    USING (auth.uid() = user_id);

-- Songs policies: Users can only access songs of their own singers
CREATE POLICY "Users can view songs of their own singers"
    ON public.songs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.singers
            WHERE singers.id = songs.singer_id
            AND singers.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert songs for their own singers"
    ON public.songs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.singers
            WHERE singers.id = songs.singer_id
            AND singers.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update songs of their own singers"
    ON public.songs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.singers
            WHERE singers.id = songs.singer_id
            AND singers.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.singers
            WHERE singers.id = songs.singer_id
            AND singers.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete songs of their own singers"
    ON public.songs
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.singers
            WHERE singers.id = songs.singer_id
            AND singers.user_id = auth.uid()
        )
    );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_singers_updated_at
    BEFORE UPDATE ON public.singers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at
    BEFORE UPDATE ON public.songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

