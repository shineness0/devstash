'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github } from 'lucide-react';
import { signInWithCredentials, signInWithGitHub } from './actions';

interface SignInFormProps {
  callbackUrl: string;
  verified?: boolean;
  urlError?: string;
}

export function SignInForm({ callbackUrl, verified, urlError }: SignInFormProps) {
  const [error, formAction, isPending] = useActionState(
    signInWithCredentials.bind(null, callbackUrl),
    ''
  );

  useEffect(() => {
    if (verified) {
      toast.success('Email verified! You can now sign in.');
    } else if (urlError === 'invalid_token') {
      toast.error('Invalid or already used verification link.');
    } else if (urlError === 'expired_token') {
      toast.error('Verification link has expired. Please register again.');
    }
  }, [verified, urlError]);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to DevStash</h1>
        <p className="text-sm text-muted-foreground">Welcome back</p>
      </div>

      <form action={formAction} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <form action={signInWithGitHub.bind(null, callbackUrl)}>
        <Button variant="outline" className="w-full" type="submit">
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
          Register
        </Link>
      </p>
    </div>
  );
}
