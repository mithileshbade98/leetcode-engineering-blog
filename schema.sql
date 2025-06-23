create table if not exists problems (
  id text primary key,
  leetcode_number integer,
  title text,
  difficulty text,
  description text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists blogs (
  id text primary key,
  title text,
  category text,
  content text,
  tags text[],
  key_takeaways text[],
  related_problems text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reviews (
  problem_id text primary key references problems(id),
  last_reviewed timestamptz,
  next_review timestamptz,
  interval integer,
  repetitions integer,
  ease_factor numeric,
  difficulty text
);

create table if not exists checkins (
  date date primary key
);
