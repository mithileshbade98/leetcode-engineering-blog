import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Get checkins data
    const { data: checkins, error: checkinsError } = await supabaseAdmin
      .from('checkins')
      .select('date, activities')
      .order('date', { ascending: false })
      .limit(365);

    if (checkinsError) throw checkinsError;

    // Get problems count by date
    const { data: problems, error: problemsError } = await supabaseAdmin
      .from('problems')
      .select('created_at');

    if (problemsError) throw problemsError;

    // Get blogs count by date
    const { data: blogs, error: blogsError } = await supabaseAdmin
      .from('blogs')
      .select('created_at');

    if (blogsError) throw blogsError;

    // Combine all activities by date
    const calendar: { [date: string]: number } = {};

    // Add checkin activities
    checkins?.forEach(checkin => {
      const date = checkin.date as string;
      calendar[date] = (calendar[date] || 0) + (checkin.activities || 1);
    });

    // Add problems (weight: 2)
    problems?.forEach(problem => {
      const date = new Date(problem.created_at as string).toISOString().split('T')[0];
      calendar[date] = (calendar[date] || 0) + 2;
    });

    // Add blogs (weight: 3)
    blogs?.forEach(blog => {
      const date = new Date(blog.created_at as string).toISOString().split('T')[0];
      calendar[date] = (calendar[date] || 0) + 3;
    });

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