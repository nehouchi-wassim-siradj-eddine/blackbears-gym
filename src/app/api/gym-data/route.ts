import { NextResponse } from 'next/server';
import { readDB } from '../../../../lib/db';

export async function GET() {
  const data = await readDB();
  if (data) {
    return NextResponse.json({ success: true, data });
  }
  return NextResponse.json({ success: false, message: "Failed to load DB" }, { status: 500 });
}
