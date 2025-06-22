import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Simple file-based storage for now
const PROBLEMS_DIR = path.join(process.cwd(), 'data', 'problems');

// Ensure problems directory exists
if (!fs.existsSync(PROBLEMS_DIR)) {
  fs.mkdirSync(PROBLEMS_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = cookies();
    const isAuthenticated = cookieStore.get('admin-auth')?.value === 'authenticated';
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const problemData = await request.json();
    
    // Add timestamp and generate ID
    const timestamp = new Date().toISOString();
    const problemId = `problem-${problemData.leetcodeNumber}-${Date.now()}`;
    
    const enrichedData = {
      ...problemData,
      id: problemId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Save to JSON file
    const fileName = `${problemId}.json`;
    const filePath = path.join(PROBLEMS_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2));
    
    console.log(`✅ Problem saved: ${fileName}`);
    console.log('📁 Data location:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      problemId,
      message: 'Problem saved successfully!' 
    });

  } catch (error) {
    console.error('❌ Error saving problem:', error);
    return NextResponse.json(
      { error: 'Failed to save problem' }, 
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve problems
export async function GET() {
  try {
    const cookieStore = cookies();
    const isAuthenticated = cookieStore.get('admin-auth')?.value === 'authenticated';
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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