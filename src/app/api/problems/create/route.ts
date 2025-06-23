import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseClient';


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
    

    const { error } = await supabaseAdmin.from('problems').insert({
      id: problemId,
      leetcode_number: problemData.leetcodeNumber,
      title: problemData.title,
      difficulty: problemData.difficulty,
      description: problemData.description,
      tags: problemData.tags,
      created_at: timestamp,
      updated_at: timestamp
    });

    if (error) throw error;
    
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

    const { data, error } = await supabaseAdmin
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ problems: data ?? [] });

  } catch (error) {
    console.error('❌ Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' }, 
      { status: 500 }
    );
  }
}