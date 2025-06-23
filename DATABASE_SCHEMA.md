# Supabase Database Schema

This project uses Supabase as the database. Below is the schema used by the API routes.

## Tables

### problems
- `id` TEXT PRIMARY KEY
- `leetcode_number` INTEGER
- `title` TEXT
- `difficulty` TEXT
- `description` TEXT
- `tags` TEXT[]
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

### blogs
- `id` TEXT PRIMARY KEY
- `title` TEXT
- `category` TEXT
- `content` TEXT
- `tags` TEXT[]
- `key_takeaways` TEXT[]
- `related_problems` TEXT[]
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

### reviews
- `problem_id` TEXT PRIMARY KEY
- `last_reviewed` TIMESTAMP WITH TIME ZONE
- `next_review` TIMESTAMP WITH TIME ZONE
- `interval` INTEGER
- `repetitions` INTEGER
- `ease_factor` NUMERIC
- `difficulty` TEXT

### checkins
- `date` DATE PRIMARY KEY

## SQL
See `schema.sql` for SQL commands to create these tables.
