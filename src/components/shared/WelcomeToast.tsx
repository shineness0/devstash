'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function WelcomeToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      toast.success('Signed in successfully. Welcome back!');

      const params = new URLSearchParams(searchParams.toString());
      params.delete('welcome');
      const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  return null;
}
