export const dynamic = 'force-dynamic';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/sidebar';
import { auth } from '@/auth';
import { WelcomeToast } from '@/components/shared/WelcomeToast';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarData, session] = await Promise.all([getSidebarData(), auth()]);
  const user = session?.user ?? null;
  return (
    <DashboardShell sidebarData={sidebarData} user={user}>
      <WelcomeToast />
      {children}
    </DashboardShell>
  );
}
