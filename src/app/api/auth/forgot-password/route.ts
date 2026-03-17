import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking whether an email is registered
  if (!user || !user.password) {
    return NextResponse.json({ success: true });
  }

  // Delete any existing reset token for this email before creating a new one
  await prisma.verificationToken.deleteMany({
    where: { identifier: `reset:${email}` },
  });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: `reset:${email}`, token, expires },
  });

  await sendPasswordResetEmail(user.name, user.email, token);

  return NextResponse.json({ success: true });
}
