import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews');

// Ensure reviews directory exists
if (!fs.existsSync(REVIEWS_DIR)) {
  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
}

export interface ReviewData {
  problemId: string;
  lastReviewed: string;
  nextReview: string;
  interval: number; // days
  repetitions: number;
  easeFactor: number;
  difficulty: 'Again' | 'Hard' | 'Good' | 'Easy';
}

// SuperMemo 2 algorithm
function calculateNextReview(review: ReviewData, quality: 0 | 1 | 2 | 3 | 4 | 5) {
  let { interval, repetitions, easeFactor } = review;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReview.toISOString(),
    lastReviewed: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  try {
    const { problemId, quality } = await request.json();
    
    const reviewFile = path.join(REVIEWS_DIR, `${problemId}.json`);
    let reviewData: ReviewData;

    if (fs.existsSync(reviewFile)) {
      reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf-8'));
    } else {
      reviewData = {
        problemId,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date().toISOString(),
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        difficulty: 'Good'
      };
    }

    const updated = calculateNextReview(reviewData, quality);
    reviewData = { ...reviewData, ...updated };

    fs.writeFileSync(reviewFile, JSON.stringify(reviewData, null, 2));

    return NextResponse.json({ success: true, reviewData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(REVIEWS_DIR)) {
      return NextResponse.json({ reviews: [] });
    }

    const files = fs.readdirSync(REVIEWS_DIR);
    const reviews = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(REVIEWS_DIR, file), 'utf-8');
        return JSON.parse(content);
      });

    // Get problems due for review
    const now = new Date();
    const dueReviews = reviews.filter(r => new Date(r.nextReview) <= now);

    return NextResponse.json({ 
      reviews, 
      dueReviews,
      totalReviews: reviews.length,
      dueCount: dueReviews.length 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}