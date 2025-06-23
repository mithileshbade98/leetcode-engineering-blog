import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';


export async function GET() {
  try {
    const calendar: { [date: string]: number } = {};
    
    const { data: checkins } = await supabaseAdmin
      .from('checkins')
      .select('date');

    checkins?.forEach(c => {
      const date = c.date as string;
      calendar[date] = (calendar[date] || 0) + 1;
    });

    const { data: problems } = await supabaseAdmin
      .from('problems')
      .select('created_at');

    problems?.forEach(p => {
      const date = new Date(p.created_at as string).toISOString().split('T')[0];
      calendar[date] = (calendar[date] || 0) + 2;
    });

    const { data: blogs } = await supabaseAdmin
      .from('blogs')
      .select('created_at');

    blogs?.forEach(b => {
      const date = new Date(b.created_at as string).toISOString().split('T')[0];
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