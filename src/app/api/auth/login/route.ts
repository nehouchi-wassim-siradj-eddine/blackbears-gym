import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_black_bears_key_2026';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === "admin@blackbears.com" && password === "AdminPassword2026") {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
