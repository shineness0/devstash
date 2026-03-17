export const dynamic = 'force-dynamic';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { getSidebarData } from '@/lib/db/sidebar';
import { auth } from '@/auth';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [sidebarData, session] = await Promise.all([getSidebarData(), auth()]);
  const user = session?.user ?? null;
  return (
    <DashboardShell sidebarData={sidebarData} user={user}>
      {children}
    </DashboardShell>
  );
}
