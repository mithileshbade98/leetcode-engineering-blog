import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { problemData } = await request.json();
    
    // Get the project root directory
    const projectRoot = process.cwd();
    
    // Git commands
    const commands = [
      'git add data/problems/*',
      `git commit -m "Add problem: ${problemData.title} (#${problemData.leetcodeNumber})"`,
      'git push origin main'
    ];

    // Execute git commands
    for (const command of commands) {
      try {
        const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
        console.log(`Command: ${command}`);
        console.log(`Output: ${stdout}`);
        if (stderr) console.error(`Error: ${stderr}`);
      } catch (error: any) {
        console.error(`Failed to execute: ${command}`, error.message);
        // Continue even if one command fails (e.g., nothing to commit)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Changes committed and pushed to GitHub' 
    });

  } catch (error) {
    console.error('GitHub commit error:', error);
    return NextResponse.json(
      { error: 'Failed to commit to GitHub' }, 
      { status: 500 }
    );
  }
}