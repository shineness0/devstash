'use server';

import { redirect } from 'next/navigation';

interface RegisterState {
  error: string;
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { error: data.error ?? 'Registration failed. Please try again.' };
  }

  redirect('/sign-in?registered=1');
}
