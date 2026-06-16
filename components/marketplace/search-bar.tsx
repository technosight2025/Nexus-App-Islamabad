import { Button, Input } from "@/components/ui";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  defaultValue,
  placeholder = "Search photographers, videographers, designers...",
}: SearchBarProps) {
  return (
    <form action="/marketplace" className="rounded-3xl border border-border bg-card p-2 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          aria-label="Search marketplace"
          className="border-transparent bg-transparent shadow-none focus:border-transparent"
          defaultValue={defaultValue}
          name="query"
          placeholder={placeholder}
          type="search"
        />
        <Button className="w-full sm:w-auto" type="submit">
          Search
        </Button>
      </div>
    </form>
  );
}
