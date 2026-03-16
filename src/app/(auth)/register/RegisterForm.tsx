'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from './actions';

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, { error: '' });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Get started with DevStash</p>
      </div>

      <form action={formAction} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            required
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            autoComplete="new-password"
          />
        </div>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
}
