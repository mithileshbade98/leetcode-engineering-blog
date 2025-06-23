import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHECKINS_FILE = path.join(process.cwd(), 'data', 'checkins.json');

interface CheckinData {
  dates: string[];
  streaks: {
    current: number;
    longest: number;
    lastCheckin: string;
  };
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function POST() {
  try {
    let checkinData: CheckinData = {
      dates: [],
      streaks: {
        current: 0,
        longest: 0,
        lastCheckin: ''
      }
    };

    // Read existing data
    if (fs.existsSync(CHECKINS_FILE)) {
      const content = fs.readFileSync(CHECKINS_FILE, 'utf-8');
      checkinData = JSON.parse(content);
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    if (checkinData.dates.includes(today)) {
      return NextResponse.json({ 
        message: 'Already checked in today!',
        currentStreak: checkinData.streaks.current 
      });
    }

    // Add today's checkin
    checkinData.dates.push(today);
    
    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (checkinData.streaks.lastCheckin === yesterdayStr) {
      checkinData.streaks.current += 1;
    } else {
      checkinData.streaks.current = 1;
    }
    
    checkinData.streaks.lastCheckin = today;
    checkinData.streaks.longest = Math.max(checkinData.streaks.current, checkinData.streaks.longest);

    // Save data
    fs.writeFileSync(CHECKINS_FILE, JSON.stringify(checkinData, null, 2));

    return NextResponse.json({
      success: true,
      currentStreak: checkinData.streaks.current,
      longestStreak: checkinData.streaks.longest
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(CHECKINS_FILE)) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckin: null
      });
    }

    const content = fs.readFileSync(CHECKINS_FILE, 'utf-8');
    const checkinData: CheckinData = JSON.parse(content);

    return NextResponse.json({
      currentStreak: checkinData.streaks.current,
      longestStreak: checkinData.streaks.longest,
      lastCheckin: checkinData.streaks.lastCheckin,
      totalDays: checkinData.dates.length
    });

  } catch (error) {
    console.error('Error fetching check-in data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}