import { resend } from './resend';

const FROM = 'onboarding@resend.dev';
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendPasswordResetEmail(
  name: string | null,
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const displayName = escapeHtml(name ?? email);

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your DevStash password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Hi ${displayName},</p>
        <p>We received a request to reset your DevStash password. Click the button below to choose a new password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
            Reset password
          </a>
        </p>
        <p style="color:#6b7280;font-size:14px;">
          Or copy this link: <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color:#6b7280;font-size:14px;">This link expires in 1 hour. If you didn&apos;t request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}


export async function sendVerificationEmail(
  name: string | null,
  email: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;
  const displayName = escapeHtml(name ?? email);

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your DevStash email',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Hi ${displayName},</p>
        <p>Thanks for signing up for DevStash. Click the button below to verify your email address.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}"
             style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
            Verify email
          </a>
        </p>
        <p style="color:#6b7280;font-size:14px;">
          Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
        <p style="color:#6b7280;font-size:14px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
}
