'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TYPE_ICON_MAP } from '@/lib/constants/item-types';
import { createItem } from '@/actions/items';

interface ItemType {
  id: string;
  name: string;
  color: string;
}

interface NewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTypes: ItemType[];
}

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);

export function NewItemModal({ open, onOpenChange, itemTypes }: NewItemModalProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [itemTypeId, setItemTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState('');

  const selectedType = itemTypes.find((t) => t.id === itemTypeId);
  const typeName = selectedType?.name ?? '';
  const showContent = CONTENT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showUrl = typeName === 'link';
  const isCode = typeName === 'snippet' || typeName === 'command';

  function handleClose() {
    onOpenChange(false);
    // Reset form
    setTitle('');
    setItemTypeId('');
    setDescription('');
    setContent('');
    setUrl('');
    setLanguage('');
    setTags('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      title,
      itemTypeId,
      description: description || null,
      content: showContent ? (content || null) : null,
      url: showUrl ? (url || null) : null,
      language: showLanguage ? (language || null) : null,
      tags: tagArray,
    });

    setSaving(false);

    if (result.success) {
      toast.success('Item created');
      handleClose();
      router.refresh();
    } else {
      const err = typeof result.error === 'string' ? result.error : 'Validation failed';
      toast.error(err);
    }
  }

  const canSubmit = title.trim().length > 0 && itemTypeId.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="new-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item title"
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-type">Type <span className="text-destructive">*</span></Label>
            <Select value={itemTypeId} onValueChange={(v) => setItemTypeId(v ?? '')}>
              <SelectTrigger id="new-type">
                <SelectValue placeholder="Select a type…" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => {
                  const Icon = TYPE_ICON_MAP[type.name];
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />}
                        <span className="capitalize">{type.name}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-description">Description</Label>
            <Textarea
              id="new-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="resize-none min-h-15"
              rows={2}
            />
          </div>

          {/* Content */}
          {showContent && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-content">Content</Label>
              <Textarea
                id="new-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isCode ? 'Paste your code here…' : 'Enter content…'}
                className={`resize-none min-h-30 text-xs ${isCode ? 'font-mono' : ''}`}
                rows={6}
              />
            </div>
          )}

          {/* Language */}
          {showLanguage && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-language">Language</Label>
              <Input
                id="new-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. TypeScript"
              />
            </div>
          )}

          {/* URL */}
          {showUrl && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-url">URL</Label>
              <Input
                id="new-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-tags">Tags</Label>
            <Input
              id="new-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma, separated, tags"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !canSubmit}>
              {saving ? 'Creating…' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
