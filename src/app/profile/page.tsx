import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getProfileData } from '@/lib/db/profile';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangePasswordForm } from './ChangePasswordForm';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import { CalendarDays, Mail } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const data = await getProfileData(session.user.id);
  const { user, isGitHubUser, hasPassword, totalItems, totalCollections, itemTypeBreakdown } = data;

  const memberSince = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(user.createdAt));

  const showChangePassword = hasPassword && !isGitHubUser;

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <h1 className="text-xl font-semibold">Profile</h1>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} image={user.image} className="h-14 w-14 text-base" />
            <div>
              <p className="font-medium">{user.name ?? 'No name set'}</p>
              <p className="text-sm text-muted-foreground">{isGitHubUser ? 'GitHub account' : 'Email account'}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage</CardTitle>
          <CardDescription>Your items and collections at a glance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Items</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-2xl font-bold">{totalCollections}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Collections</p>
            </div>
          </div>

          {itemTypeBreakdown.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                By Type
              </p>
              <div className="space-y-1">
                {itemTypeBreakdown
                  .sort((a, b) => b.count - a.count)
                  .map(({ type, count }) => {
                    const Icon = TYPE_ICON_MAP[type.name];
                    return (
                      <div key={type.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          {Icon && (
                            <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                          )}
                          <span className="text-sm capitalize">{type.name}</span>
                        </div>
                        <span className="text-sm font-medium tabular-nums">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      {showChangePassword && <ChangePasswordForm />}

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
