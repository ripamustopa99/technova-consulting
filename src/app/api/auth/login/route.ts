import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'technova_fallback_secret_key_for_development'
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Parse input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = parsed.data;

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kredensial tidak valid' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Kredensial tidak valid' },
        { status: 401 }
      );
    }

    // Sign JWT
    const alg = 'HS256';
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Create response
    const response = NextResponse.json(
      { message: 'Login berhasil' },
      { status: 200 }
    );

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
