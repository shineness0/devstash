import { redirect } from 'next/navigation';
import { ResetPasswordForm } from './ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/forgot-password');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}
