# Supabase Database Schema

This project uses Supabase as the database. Below is the schema used by the API routes.

## Tables

### problems

- `id` UUID PRIMARY KEY
- `leetcode_number` INTEGER UNIQUE NOT NULL
- `title` TEXT NOT NULL
- `difficulty` TEXT CHECK (Easy, Medium, Hard)
- `category` TEXT CHECK (ml-ops, distributed-systems, recommendation-systems, general)
- `description` TEXT
- `solution` TEXT
- `time_complexity` TEXT
- `space_complexity` TEXT
- `tags` TEXT[]
- `leetcode_url` TEXT
- `lld_question` TEXT
- `lld_approach` TEXT
- `lld_tech_stack` TEXT[]
- `lld_code_example` TEXT
- `hld_question` TEXT
- `hld_approach` TEXT
- `hld_tech_stack` TEXT[]
- `hld_architecture` TEXT
- `system_design_question` TEXT
- `system_design_approach` TEXT
- `system_design_diagram` TEXT
- `scaling_considerations` TEXT
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

### blogs

- `id` UUID PRIMARY KEY
- `title` TEXT NOT NULL
- `category` TEXT CHECK (ml-ops, distributed-systems, recommendation-systems)
- `content` TEXT NOT NULL
- `tags` TEXT[]
- `key_takeaways` TEXT[]
- `related_problems` TEXT[]
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

### reviews

- `id` UUID PRIMARY KEY
- `problem_id` UUID REFERENCES problems(id)
- `last_reviewed` TIMESTAMP WITH TIME ZONE
- `next_review` TIMESTAMP WITH TIME ZONE
- `interval_days` INTEGER
- `repetitions` INTEGER
- `ease_factor` DECIMAL
- `created_at` TIMESTAMP WITH TIME ZONE

### checkins

- `id` UUID PRIMARY KEY
- `date` DATE UNIQUE NOT NULL
- `activities` INTEGER DEFAULT 1
- `created_at` TIMESTAMP WITH TIME ZONE

### activity_log

- `id` UUID PRIMARY KEY
- `type` TEXT CHECK (problem, blog, review, checkin)
- `title` TEXT
- `category` TEXT
- `metadata` JSONB
- `created_at` TIMESTAMP WITH TIME ZONE

## Indexes

- `idx_problems_category` ON problems(category)
- `idx_problems_created_at` ON problems(created_at)
- `idx_blogs_category` ON blogs(category)
- `idx_blogs_created_at` ON blogs(created_at)
- `idx_reviews_next_review` ON reviews(next_review)
- `idx_reviews_problem_id` ON reviews(problem_id)
- `idx_checkins_date` ON checkins(date)
- `idx_activity_log_created_at` ON activity_log(created_at)
- `idx_activity_log_type` ON activity_log(type)

## SQL

See `schema.sql` for SQL commands to create these tables.
