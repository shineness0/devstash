import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = name ? getInitials(name) : '?';

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? 'User avatar'}
        width={32}
        height={32}
        className={cn('h-8 w-8 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold',
        className
      )}
    >
      {initials}
    </div>
  );
}
