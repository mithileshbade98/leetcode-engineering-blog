import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews');
const PROBLEMS_DIR = path.join(process.cwd(), 'data', 'problems');

export async function GET() {
  try {
    const reminders: string[] = [];
    
    // Check for due reviews
    if (fs.existsSync(REVIEWS_DIR)) {
      const files = fs.readdirSync(REVIEWS_DIR);
      const now = new Date();
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(path.join(REVIEWS_DIR, file), 'utf-8');
          const review = JSON.parse(content);
          
          if (new Date(review.nextReview) <= now) {
            // Get problem title
            const problemFile = path.join(PROBLEMS_DIR, `${review.problemId}.json`);
            if (fs.existsSync(problemFile)) {
              const problemContent = fs.readFileSync(problemFile, 'utf-8');
              const problem = JSON.parse(problemContent);
              reminders.push(`Review due: ${problem.title} (${problem.difficulty})`);
            }
          }
        }
      }
    }

    // Add daily study reminder if no check-in today
    const checkinsFile = path.join(process.cwd(), 'data', 'checkins.json');
    if (fs.existsSync(checkinsFile)) {
      const content = fs.readFileSync(checkinsFile, 'utf-8');
      const checkinData = JSON.parse(content);
      const today = new Date().toISOString().split('T')[0];
      
      if (!checkinData.dates.includes(today)) {
        reminders.push("Don't forget your daily check-in! Keep your streak alive 🔥");
      }
    }

    // Add blog reminder (write at least one blog per week)
    if (fs.existsSync(BLOGS_DIR)) {
      const files = fs.readdirSync(BLOGS_DIR);
      const recentBlogs = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
          return JSON.parse(content);
        })
        .filter(blog => {
          const blogDate = new Date(blog.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return blogDate > weekAgo;
        });
      
      if (recentBlogs.length === 0) {
        reminders.push("Time to write a technical blog! Share your knowledge 📝");
      }
    }

    return NextResponse.json({ reminders });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}