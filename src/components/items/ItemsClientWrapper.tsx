'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { ItemDrawer } from '@/components/items/ItemDrawer';
import type { ItemWithType, ItemDetail } from '@/lib/db/items';

interface ItemsClientWrapperProps {
  items: ItemWithType[];
  gridClassName?: string;
}

export function ItemsClientWrapper({ items, gridClassName }: ItemsClientWrapperProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerItem, setDrawerItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCardClick = useCallback(async (id: string) => {
    setSelectedId(id);
    setDrawerItem(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data: ItemDetail = await res.json();
        setDrawerItem(data);
      } else {
        toast.error('Failed to load item');
        handleClose();
      }
    } catch {
      toast.error('Failed to load item');
      handleClose();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    setDrawerItem(null);
    setLoading(false);
  }, []);

  return (
    <>
      <div className={gridClassName}>
        {items.map((item) => (
          <button
            key={item.id}
            className="text-left w-full"
            onClick={() => handleCardClick(item.id)}
          >
            <ItemCard item={item} />
          </button>
        ))}
      </div>

      <ItemDrawer
        itemId={selectedId}
        item={drawerItem}
        loading={loading}
        onClose={handleClose}
      />
    </>
  );
}
