'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { updateItem as dbUpdateItem } from '@/lib/db/items';

const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), { message: 'Invalid URL' }),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export async function updateItem(itemId: string, formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: 'Unauthorized' };
  }

  const parsed = UpdateItemSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const item = await dbUpdateItem(itemId, session.user.id, {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      content: parsed.data.content ?? null,
      url: parsed.data.url ?? null,
      language: parsed.data.language ?? null,
      tags: parsed.data.tags,
    });
    return { success: true as const, data: item };
  } catch {
    return { success: false as const, error: 'Failed to update item' };
  }
}
