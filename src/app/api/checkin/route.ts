import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

interface CheckinData {
  date: string;
}

function calculateStreaks(dates: string[]): { current: number; longest: number; lastCheckin: string | null } {
  if (dates.length === 0) {
    return { current: 0, longest: 0, lastCheckin: null };
  }

  const sorted = dates
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let current = 1;
  let longest = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current += 1;
    } else if (diff > 1) {
      current = 1;
    }
    if (current > longest) longest = current;
  }

  return { current, longest, lastCheckin: sorted[sorted.length - 1].toISOString().split('T')[0] };
}

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabaseAdmin
      .from('checkins')
      .select('date')
      .eq('date', today)
      .maybeSingle();

    const { data: allDatesData } = await supabaseAdmin
      .from('checkins')
      .select('date')
      .order('date');

    const dates = allDatesData?.map(d => d.date as string) || [];

    if (existing) {
      const streak = calculateStreaks(dates);
      return NextResponse.json({
        message: 'Already checked in today!',
        currentStreak: streak.current,
        longestStreak: streak.longest
      });
    }

    await supabaseAdmin.from('checkins').insert({ date: today });

    const updatedDates = [...dates, today];
    const streak = calculateStreaks(updatedDates);

    return NextResponse.json({
      success: true,
      currentStreak: streak.current,
      longestStreak: streak.longest
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from('checkins')
      .select('date')
      .order('date');

    const dates = data?.map(d => d.date as string) || [];
    const streak = calculateStreaks(dates);

    return NextResponse.json({
      currentStreak: streak.current,
      longestStreak: streak.longest,
      lastCheckin: streak.lastCheckin,
      totalDays: dates.length
    });

  } catch (error) {
    console.error('Error fetching check-in data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}