import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavbarItem {
  href: string;
  label: string;
  isActive?: boolean;
}

interface NavbarProps {
  brandName: string;
  navItems?: readonly NavbarItem[];
  actions?: ReactNode;
  className?: string;
}

export function Navbar({ brandName, navItems = [], actions, className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur", className)}>
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 text-base font-bold tracking-tight" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            N
          </span>
          <span>{brandName}</span>
        </Link>

        {navItems.length > 0 ? (
          <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
            {navItems.map((item) => (
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground",
                  item.isActive ? "bg-primary text-primary-foreground hover:text-primary-foreground" : null,
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </nav>
    </header>
  );
}
