import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({ className, label, helperText, error, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          "h-11 w-full rounded-2xl border bg-card px-4 text-sm text-foreground shadow-sm transition-colors",
          "placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10",
          error ? "border-danger" : "border-border",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-danger">{error}</span>
      ) : helperText ? (
        <span className="text-xs font-normal text-muted">{helperText}</span>
      ) : null}
    </label>
  );
}
