'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

function withWelcome(url: string): string {
  const u = new URL(url, 'http://localhost');
  u.searchParams.set('welcome', '1');
  return u.pathname + u.search;
}

export async function signInWithCredentials(
  callbackUrl: string,
  _prevState: string,
  formData: FormData
): Promise<string> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: withWelcome(callbackUrl),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const cause = (error.cause as { err?: Error } | undefined)?.err;
      if (cause?.message === 'EmailNotVerified') {
        return 'Please verify your email before signing in. Check your inbox.';
      }
      return 'Invalid email or password.';
    }
    throw error; // re-throw NEXT_REDIRECT
  }
  return '';
}

export async function signInWithGitHub(callbackUrl: string) {
  await signIn('github', { redirectTo: withWelcome(callbackUrl) });
}
