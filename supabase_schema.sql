-- FILE: supabase_schema.sql
-- Run this in your Supabase SQL editor to initialize the database structure

create table profiles (
  id           text primary key,       -- Firebase UID
  email        text unique not null,
  role         text default 'viewer',  -- 'admin' | 'member' | 'viewer'
  display_name text,
  avatar_url   text,
  created_at   timestamptz default now()
);

create table landing_content (
  id           uuid primary key default gen_random_uuid(),
  section      text not null,   -- 'hero'|'events'|'gallery'|'marquee'|'announcements'
  key          text not null,   -- e.g. 'title', 'subtitle', 'items', 'images'
  value        jsonb not null,  -- flexible: string, array, object
  updated_at   timestamptz default now(),
  updated_by   text,            -- Firebase UID
  unique(section, key)
);

create table events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  date         date,
  location     text,
  banner_url   text,
  is_published boolean default false,
  created_at   timestamptz default now(),
  created_by   text
);

create table gallery (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,        -- Backblaze CDN URL
  b2_key       text not null,        -- path in bucket, for deletion
  caption      text,
  category     text default 'general',
  uploaded_at  timestamptz default now(),
  uploaded_by  text
);

create table leaderboard (
  id           uuid primary key default gen_random_uuid(),
  player_name  text not null,
  score        int not null,
  distance     int,
  level        int,
  achieved_at  timestamptz default now()
);

create table applications (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  message      text,
  status       text default 'pending', -- 'pending'|'reviewed'|'accepted'|'rejected'
  submitted_at timestamptz default now()
);

create table members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,
  bio          text,
  initials     text,
  color        text,
  avatar_url   text,
  is_active    boolean default true,
  joined_at    timestamptz default now()
);

create table projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  tag          text,
  description  text,
  tech_stack   text[],
  thumbnail_icon text,
  bg_gradient  text,
  github_url   text,
  featured     boolean default false,
  created_at   timestamptz default now()
);

-- RLS: only service role can write; anon can read public data
alter table landing_content enable row level security;
alter table events enable row level security;
alter table gallery enable row level security;
-- Add policies as needed
