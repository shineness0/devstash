import { SignInForm } from './SignInForm';

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl = '/dashboard', registered } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignInForm callbackUrl={callbackUrl} registered={registered === '1'} />
    </div>
  );
}
