import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

interface ReviewData {
  problem_id: string;
  last_reviewed: string;
  next_review: string;
  interval_days: number;
  repetitions: number;
  ease_factor: number;
}

// SuperMemo 2 algorithm
function calculateNextReview(review: ReviewData, quality: 0 | 1 | 2 | 3 | 4 | 5) {
  let { interval_days, repetitions, ease_factor } = review;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval_days = 1;
  }

  ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval_days);

  return {
    interval_days,
    repetitions,
    ease_factor,
    next_review: nextReview.toISOString(),
    last_reviewed: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  try {
    const { problemId, quality } = await request.json();
    
    // Check if review exists
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('problem_id', problemId)
      .single();

    let reviewData: ReviewData;
    
    if (existingReview) {
      reviewData = existingReview as ReviewData;
    } else {
      // Create new review
      reviewData = {
        problem_id: problemId,
        last_reviewed: new Date().toISOString(),
        next_review: new Date().toISOString(),
        interval_days: 0,
        repetitions: 0,
        ease_factor: 2.5
      };
    }

    const updated = calculateNextReview(reviewData, quality);
    
    // Update or insert review
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .upsert({
        problem_id: problemId,
        last_reviewed: updated.last_reviewed,
        next_review: updated.next_review,
        interval_days: updated.interval_days,
        repetitions: updated.repetitions,
        ease_factor: updated.ease_factor
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabaseAdmin
      .from('activity_log')
      .insert({
        type: 'review',
        title: `Reviewed problem`,
        metadata: { 
          problem_id: problemId, 
          quality,
          interval_days: updated.interval_days 
        }
      });

    return NextResponse.json({ success: true, reviewData: data });
    
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const now = new Date().toISOString();
    
    // Get all reviews with problem details
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        problems (
          id,
          title,
          difficulty,
          category
        )
      `)
      .order('next_review', { ascending: true });

    if (error) throw error;

    // Filter due reviews
    const dueReviews = reviews?.filter(r => r.next_review <= now) || [];

    return NextResponse.json({
      reviews: reviews || [],
      dueReviews,
      totalReviews: reviews?.length || 0,
      dueCount: dueReviews.length
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}