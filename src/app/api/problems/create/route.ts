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
    console.log('Received problem data:', problemData);
    
    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('problems')
      .insert({
        leetcode_number: problemData.leetcodeNumber,
        title: problemData.title,
        difficulty: problemData.difficulty,
        category: problemData.category || 'general',
        description: problemData.description,
        solution: problemData.solution,
        time_complexity: problemData.timeComplexity,
        space_complexity: problemData.spaceComplexity,
        tags: problemData.tags || [],
        leetcode_url: problemData.leetcodeUrl,
        lld_question: problemData.lldQuestion,
        lld_approach: problemData.lldApproach,
        lld_tech_stack: problemData.lldTechStack || [],
        lld_code_example: problemData.lldCodeExample,
        hld_question: problemData.hldQuestion,
        hld_approach: problemData.hldApproach,
        hld_tech_stack: problemData.hldTechStack || [],
        hld_architecture: problemData.hldArchitecture,
        system_design_question: problemData.systemDesignQuestion,
        system_design_approach: problemData.systemDesignApproach,
        system_design_diagram: problemData.systemDesignDiagram,
        scaling_considerations: problemData.scalingConsiderations,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Problem saved successfully:', data);

    // Log activity
    await supabaseAdmin
      .from('activity_log')
      .insert({
        type: 'problem',
        title: problemData.title,
        category: problemData.category || 'general',
        metadata: { 
          leetcode_number: problemData.leetcodeNumber,
          difficulty: problemData.difficulty 
        }
      });

    return NextResponse.json({ 
      success: true, 
      problemId: data.id,
      message: 'Problem saved successfully!' 
    });

  } catch (error: any) {
    console.error('Error saving problem:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save problem', 
        details: error.message,
        hint: error.hint || 'Check database connection and table schema'
      }, 
      { status: 500 }
    );
  }
}