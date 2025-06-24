import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test connection
    const { data, error } = await supabaseAdmin
      .from('problems')
      .select('count')
      .single();

    if (error) {
      console.error('Database test error:', error);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: error.message,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      problemCount: data?.count || 0
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Connection test failed',
      details: error.message 
    }, { status: 500 });
  }
}