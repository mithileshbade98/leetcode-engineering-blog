-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS problems CASCADE;

-- Problems table
CREATE TABLE problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  leetcode_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT CHECK (category IN ('ml-ops', 'distributed-systems', 'recommendation-systems', 'general')),
  description TEXT,
  solution TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  tags TEXT[] DEFAULT '{}',
  leetcode_url TEXT,
  lld_question TEXT,
  lld_approach TEXT,
  lld_tech_stack TEXT[] DEFAULT '{}',
  lld_code_example TEXT,
  hld_question TEXT,
  hld_approach TEXT,
  hld_tech_stack TEXT[] DEFAULT '{}',
  hld_architecture TEXT,
  system_design_question TEXT,
  system_design_approach TEXT,
  system_design_diagram TEXT,
  scaling_considerations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('ml-ops', 'distributed-systems', 'recommendation-systems')),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  key_takeaways TEXT[] DEFAULT '{}',
  related_problems TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  ease_factor DECIMAL DEFAULT 2.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  activities INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('problem', 'blog', 'review', 'checkin')),
  title TEXT,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_problems_category ON problems(category);
CREATE INDEX idx_problems_created_at ON problems(created_at);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
CREATE INDEX idx_reviews_next_review ON reviews(next_review);
CREATE INDEX idx_reviews_problem_id ON reviews(problem_id);
CREATE INDEX idx_checkins_date ON checkins(date);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX idx_activity_log_type ON activity_log(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on problems" ON problems FOR ALL USING (true);
CREATE POLICY "Allow all operations on blogs" ON blogs FOR ALL USING (true);
CREATE POLICY "Allow all operations on reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Allow all operations on checkins" ON checkins FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_log" ON activity_log FOR ALL USING (true);