import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BLOGS_DIR = path.join(process.cwd(), 'data', 'blogs');

// Ensure blogs directory exists
if (!fs.existsSync(BLOGS_DIR)) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    if (!fs.existsSync(BLOGS_DIR)) {
      return NextResponse.json({ blogs: [] });
    }

    const files = fs.readdirSync(BLOGS_DIR);
    let blogs = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(BLOGS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
    
    const enrichedData = {
      ...blogData,
      id: blogId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const fileName = `${blogId}.json`;
    const filePath = path.join(BLOGS_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2));
    
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