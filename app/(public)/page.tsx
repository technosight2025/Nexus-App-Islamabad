import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="grid gap-6">
          <Badge variant="accent">Production-grade SaaS foundation</Badge>
          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Nexus connects creative teams, bookings, events, and client workflows.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              This increment establishes the project structure and reusable design system foundation for the
              marketplace, bookings, CRM, events, payments, and admin modules.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Explore foundation</Button>
            <Button variant="secondary">View components</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Design system check</CardTitle>
            <CardDescription>Reusable primitives for future Nexus feature screens.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input helperText="Search wiring will be added inside the marketplace module." label="Marketplace search" />
            <div className="flex flex-wrap gap-2">
              <Badge>Marketplace</Badge>
              <Badge variant="success">Bookings</Badge>
              <Badge variant="warning">Admin review</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
