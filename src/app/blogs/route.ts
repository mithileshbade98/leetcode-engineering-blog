import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    let blogs = data || [];

    // Filter by category if specified
    if (category) {
      blogs = blogs.filter(blog => blog.category === category);
    }

    // Limit results if specified
    if (limit) {
      blogs = blogs.slice(0, parseInt(limit));
    }

    return NextResponse.json({ blogs });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const blogData = await request.json();
    
    const timestamp = new Date().toISOString();
    const blogId = `blog-${Date.now()}`;

    const { error } = await supabaseAdmin.from('blogs').insert({
      id: blogId,
      title: blogData.title,
      category: blogData.category,
      content: blogData.content,
      tags: blogData.tags,
      key_takeaways: blogData.keyTakeaways,
      related_problems: blogData.relatedProblems,
      created_at: timestamp,
      updated_at: timestamp
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      blogId,
      message: 'Blog saved successfully!'
    });

  } catch (error) {
    console.error('Error saving blog:', error);
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
  }
}