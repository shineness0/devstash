import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getItemsByType } from '@/lib/db/items';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';

// Sidebar links use plural slugs (e.g. /items/snippets); DB names are singular
const SLUG_TO_TYPE: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  commands: 'command',
  notes: 'note',
  files: 'file',
  images: 'image',
  links: 'link',
};

interface Props {
  params: Promise<{ type: string }>;
}

export default async function ItemsTypePage({ params }: Props) {
  const { type: slug } = await params;
  const typeName = SLUG_TO_TYPE[slug];

  if (!typeName) notFound();

  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const items = await getItemsByType(session.user.id, typeName);

  const Icon = TYPE_ICON_MAP[typeName];
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <h1 className="text-lg font-semibold">{label}</h1>
        <span className="text-sm text-muted-foreground">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {slug} yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
