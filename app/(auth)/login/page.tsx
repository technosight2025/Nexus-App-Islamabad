import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Nexus",
  description: "Sign in to your Nexus workspace.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Sign in to Nexus</h1>
          <p className="mt-2 text-sm text-muted">Access your marketplace, CRM, events, and bookings workspace.</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              cardBox: "shadow-none",
              rootBox: "mx-auto w-full",
            },
          }}
          routing="path"
          path="/login"
          signUpUrl="/register"
        />
      </section>
    </main>
  );
}
