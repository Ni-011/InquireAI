import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid email or password (min 8 chars)' }, { status: 400 });
    }

    const result = await register(email, password, name);
    return NextResponse.json({ message: 'User created', ...result }, { status: 201 });

  } catch (error: any) {
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 