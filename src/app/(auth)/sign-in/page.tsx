import { SignInForm } from './SignInForm';

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    verified?: string;
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl = '/dashboard', verified, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignInForm
        callbackUrl={callbackUrl}
        verified={verified === '1'}
        urlError={error}
      />
    </div>
  );
}
