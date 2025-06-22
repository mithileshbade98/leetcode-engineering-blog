import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROBLEMS_DIR = path.join(process.cwd(), 'data', 'problems');

export async function GET() {
  try {
    if (!fs.existsSync(PROBLEMS_DIR)) {
      return NextResponse.json({ problems: [] });
    }

    const files = fs.readdirSync(PROBLEMS_DIR);
    const problems = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(PROBLEMS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ problems });

  } catch (error) {
    console.error('❌ Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' }, 
      { status: 500 }
    );
  }
}