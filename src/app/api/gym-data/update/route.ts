import { NextResponse } from 'next/server';
import { writeDB } from '../../../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_black_bears_key_2026';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json();
    const result = await writeDB(body);

    if (result) {
      return NextResponse.json({ success: true, message: "Database updated successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Failed to write DB" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
