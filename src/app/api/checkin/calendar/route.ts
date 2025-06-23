import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHECKINS_FILE = path.join(process.cwd(), 'data', 'checkins.json');
const PROBLEMS_DIR = path.join(process.cwd(), 'data', 'problems');
const BLOGS_DIR = path.join(process.cwd(), 'data', 'blogs');

export async function GET() {
  try {
    const calendar: { [date: string]: number } = {};
    
    // Add check-ins
    if (fs.existsSync(CHECKINS_FILE)) {
      const content = fs.readFileSync(CHECKINS_FILE, 'utf-8');
      const checkinData = JSON.parse(content);
      checkinData.dates.forEach((date: string) => {
        calendar[date] = (calendar[date] || 0) + 1;
      });
    }

    // Add problems
    if (fs.existsSync(PROBLEMS_DIR)) {
      const files = fs.readdirSync(PROBLEMS_DIR);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(path.join(PROBLEMS_DIR, file), 'utf-8');
          const problem = JSON.parse(content);
          const date = new Date(problem.createdAt).toISOString().split('T')[0];
          calendar[date] = (calendar[date] || 0) + 2; // Problems count more
        }
      });
    }

    // Add blogs
    if (fs.existsSync(BLOGS_DIR)) {
      const files = fs.readdirSync(BLOGS_DIR);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
          const blog = JSON.parse(content);
          const date = new Date(blog.createdAt).toISOString().split('T')[0];
          calendar[date] = (calendar[date] || 0) + 3; // Blogs count most
        }
      });
    }

    // Convert to array format
    const calendarArray = Object.entries(calendar).map(([date, count]) => ({
      date,
      count
    }));

    return NextResponse.json({ calendar: calendarArray });

  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}