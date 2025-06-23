import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';


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
    
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('problem_id', problemId)
      .maybeSingle();

    let reviewData: ReviewData = existing || {
      problemId,
      lastReviewed: new Date().toISOString(),
      nextReview: new Date().toISOString(),
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      difficulty: 'Good'
    };

    const updated = calculateNextReview(reviewData, quality);
    reviewData = { ...reviewData, ...updated };

    const { error } = await supabaseAdmin
      .from('reviews')
      .upsert({
        problem_id: reviewData.problemId,
        last_reviewed: reviewData.lastReviewed,
        next_review: reviewData.nextReview,
        interval: reviewData.interval,
        repetitions: reviewData.repetitions,
        ease_factor: reviewData.easeFactor,
        difficulty: reviewData.difficulty
      });

    if (error) throw error;

    return NextResponse.json({ success: true, reviewData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('reviews').select('*');

    if (error) throw error;

    const reviews = data || [];

    const now = new Date();
    const dueReviews = reviews.filter(r => new Date(r.next_review) <= now);

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