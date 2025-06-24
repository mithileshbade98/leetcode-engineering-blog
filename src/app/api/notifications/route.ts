import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const reminders: string[] = [];
    
    // Check for due reviews
    const now = new Date().toISOString();
    const { data: dueReviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        problems (
          title,
          difficulty
        )
      `)
      .lte('next_review', now);

    dueReviews?.forEach(review => {
      if (review.problems) {
        reminders.push(`Review due: ${review.problems.title} (${review.problems.difficulty})`);
      }
    });

    // Check if checked in today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayCheckin } = await supabaseAdmin
      .from('checkins')
      .select('*')
      .eq('date', today)
      .single();

    if (!todayCheckin) {
      reminders.push("Don't forget your daily check-in! Keep your streak alive 🔥");
    }

    // Check recent blog activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: recentBlogs } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .gte('created_at', weekAgo.toISOString());

    if (!recentBlogs || recentBlogs.length === 0) {
      reminders.push("Time to write a technical blog! Share your knowledge 📝");
    }

    return NextResponse.json({ reminders });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}