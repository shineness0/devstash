import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
      <div className="flex flex-1 items-center gap-3">
        <span className="text-lg font-semibold tracking-tight">DevStash</span>
      </div>
      <div className="flex w-full max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      </div>
      <Button size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        New Item
      </Button>
    </header>
  );
}
