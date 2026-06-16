import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import type { Category, SearchFilters } from "@/modules/marketplace/types";

interface FilterSidebarProps {
  categories: Category[];
  filters: SearchFilters;
}

export function FilterSidebar({ categories, filters }: FilterSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/marketplace" className="grid gap-6">
            {filters.query ? <input name="query" type="hidden" value={filters.query} /> : null}

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-foreground">Category</legend>
              <label className="flex items-center gap-3 text-sm text-muted">
                <input
                  className="h-4 w-4 accent-primary"
                  defaultChecked={!filters.categorySlug}
                  name="categorySlug"
                  type="radio"
                  value=""
                />
                All categories
              </label>
              {categories.map((category) => (
                <label className="flex items-center justify-between gap-3 text-sm text-muted" key={category.id}>
                  <span className="flex items-center gap-3">
                    <input
                      className="h-4 w-4 accent-primary"
                      defaultChecked={filters.categorySlug === category.slug}
                      name="categorySlug"
                      type="radio"
                      value={category.slug}
                    />
                    {category.name}
                  </span>
                  <span className="text-xs">{category.listingCount}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-foreground">City</legend>
              <Input
                defaultValue={filters.city ?? ""}
                name="city"
                placeholder="Any city"
                type="text"
              />
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-foreground">Budget</legend>
              <div className="grid grid-cols-2 gap-3">
                <Input defaultValue={filters.minPrice} min={0} name="minPrice" placeholder="Min" type="number" />
                <Input defaultValue={filters.maxPrice} min={0} name="maxPrice" placeholder="Max" type="number" />
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-foreground">Minimum rating</legend>
              <Input
                defaultValue={filters.minRating ?? ""}
                max={5}
                min={0}
                name="minRating"
                placeholder="Any rating"
                step={0.1}
                type="number"
              />
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-foreground">Sort</legend>
              <select
                className="h-11 rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                defaultValue={filters.sort ?? "recommended"}
                name="sort"
              >
                <option value="recommended">Recommended</option>
                <option value="rating_desc">Highest rated</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="newest">Newest</option>
              </select>
            </fieldset>

            <div className="grid gap-2">
              <Button type="submit">Apply filters</Button>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-surface"
                href="/marketplace"
              >
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </aside>
  );
}
