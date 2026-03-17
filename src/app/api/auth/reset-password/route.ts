import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, resetPasswordLimiter, getIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getIP(request);
  const rateLimitRes = await checkRateLimit(resetPasswordLimiter, `reset-password:${ip}`);
  if (rateLimitRes) return rateLimitRes;

  const body = await request.json();
  const { token, password, confirmPassword } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  if (!password || !confirmPassword || typeof password !== "string" || typeof confirmPassword !== "string") {
    return NextResponse.json(
      { error: "Password and confirmPassword are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || !record.identifier.startsWith("reset:")) {
    return NextResponse.json(
      { error: "Invalid or already used reset link" },
      { status: 400 }
    );
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json(
      { error: "Reset link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const email = record.identifier.replace("reset:", "");
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
