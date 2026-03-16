import Link from 'next/link';
import { MailOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailOpen className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Check your email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            We sent a verification link to{' '}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              'your email address'
            )}
            . Click the link to activate your account.
          </p>
          <p className="text-xs">Didn&apos;t receive it? Check your spam folder.</p>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/sign-in"
            className="inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
