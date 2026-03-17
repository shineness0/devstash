'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { signInWithCredentials, signInWithGitHub } from './actions';

interface SignInFormProps {
  callbackUrl: string;
  verified?: boolean;
  passwordReset?: boolean;
  urlError?: string;
}

export function SignInForm({ callbackUrl, verified, passwordReset, urlError }: SignInFormProps) {
  const [error, formAction, isPending] = useActionState(
    signInWithCredentials.bind(null, callbackUrl),
    ''
  );

  useEffect(() => {
    if (passwordReset) {
      toast.success('Password reset! You can now sign in with your new password.');
    } else if (verified) {
      toast.success('Email verified! You can now sign in.');
    } else if (urlError === 'invalid_token') {
      toast.error('Invalid or already used verification link.');
    } else if (urlError === 'expired_token') {
      toast.error('Verification link has expired. Please register again.');
    }
  }, [verified, passwordReset, urlError]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Sign in to DevStash</CardTitle>
        <CardDescription>Welcome back</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
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
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
