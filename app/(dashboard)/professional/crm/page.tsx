import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalCRMDashboard } from "@/components/crm";
import { Badge } from "@/components/ui";
import { crmQueryOptions } from "@/modules/crm/hooks";

export const metadata: Metadata = {
  title: "Professional CRM | Nexus",
  description: "Manage creative production leads in the Nexus professional CRM.",
};

const sidebarItems = [
  { href: "/professional/crm", label: "CRM", isActive: true },
  { href: "/professional/bookings", label: "Bookings" },
  { href: "/professional/listings", label: "Listings" },
  { href: "/professional/events", label: "Events" },
  { href: "/professional/settings", label: "Settings" },
];

export default async function ProfessionalCRMPage() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(crmQueryOptions.board()),
    queryClient.prefetchQuery(crmQueryOptions.pipelineStages()),
  ]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted-surface/40">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-5 grid gap-2">
              <Badge variant="accent">Professional</Badge>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">Workspace</h2>
                <p className="mt-1 text-sm text-muted">Manage leads, work, and client operations.</p>
              </div>
            </div>
            <nav className="grid gap-1" aria-label="Professional dashboard">
              {sidebarItems.map((item) => (
                <Link
                  className={
                    item.isActive
                      ? "rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                      : "rounded-2xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-muted-surface hover:text-foreground"
                  }
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <section className="grid gap-6">
          <header className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Professional CRM</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Lead pipeline</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  Track inquiries, move opportunities through pipeline stages, and open lead details from a clean SaaS
                  dashboard workspace.
                </p>
              </div>
              <div className="rounded-2xl bg-muted-surface px-4 py-3 text-sm text-muted">
                Kanban-ready CRM
              </div>
            </div>
          </header>

          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfessionalCRMDashboard />
          </HydrationBoundary>
        </section>
      </div>
    </main>
  );
}
