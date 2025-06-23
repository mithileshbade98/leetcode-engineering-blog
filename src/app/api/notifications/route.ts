import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';



export async function GET() {
  try {
    const reminders: string[] = [];
    
    const { data: reviews } = await supabaseAdmin.from('reviews').select('*');
    const now = new Date();
    for (const review of reviews || []) {
      if (new Date(review.next_review as string) <= now) {
        const { data: problem } = await supabaseAdmin
          .from('problems')
          .select('title, difficulty')
          .eq('id', review.problem_id)
          .maybeSingle();
        if (problem) {
          reminders.push(`Review due: ${problem.title} (${problem.difficulty})`);
        }
      }
    }

    // Add daily study reminder if no check-in today
    const { data: checkins } = await supabaseAdmin
      .from('checkins')
      .select('date');
    const today = new Date().toISOString().split('T')[0];
    const checkedInToday = checkins?.some(c => c.date === today);
    if (!checkedInToday) {
      reminders.push("Don't forget your daily check-in! Keep your streak alive 🔥");
    }

    // Add blog reminder (write at least one blog per week)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: blogs } = await supabaseAdmin
      .from('blogs')
      .select('created_at');
    const recentBlogs = (blogs || []).filter(b => new Date(b.created_at as string) > weekAgo);
    if (recentBlogs.length === 0) {
      reminders.push("Time to write a technical blog! Share your knowledge 📝");
    }

    return NextResponse.json({ reminders });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}