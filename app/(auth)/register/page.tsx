import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Nexus",
  description: "Create your Nexus account.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Start with Nexus</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Join as a client, professional, venue owner, or creative operator.</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              cardBox: "shadow-none",
              rootBox: "mx-auto w-full",
            },
          }}
          routing="path"
          path="/register"
          signInUrl="/login"
        />
      </section>
    </main>
  );
}
