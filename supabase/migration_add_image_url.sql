-- Migration: Add image_url column to singers table
-- Run this if you already have an existing singers table

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'singers' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE public.singers ADD COLUMN image_url TEXT;
    END IF;
END $$;

