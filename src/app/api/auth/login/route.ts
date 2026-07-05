import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { verifyPassword, signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Retrieve user using raw SQL
    const user = await queryOne(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    const response = NextResponse.json(
      { 
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        message: 'Logged in successfully'
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
