import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json(
      { message: 'Logout berhasil' },
      { status: 200 }
    );

    // Hapus cookie auth_token
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat logout' },
      { status: 500 }
    );
  }
}
