import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    return NextResponse.json({ token: process.env.ADMIN_TOKEN });
  }

  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );
}
