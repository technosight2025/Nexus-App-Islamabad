"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";

export interface EventSettingsValue {
  description: string;
  coverImageUrl: string;
  qrExpiresAt: string;
}

interface EventSettingsProps {
  value: EventSettingsValue;
  errors?: Partial<Record<keyof EventSettingsValue, string>>;
  onChange: (value: EventSettingsValue) => void;
}

export function EventSettings({ value, errors = {}, onChange }: EventSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event settings</CardTitle>
        <CardDescription>Configure Event Memories details before publishing the upload QR.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          <span>Description</span>
          <textarea
            className="min-h-28 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            onChange={(event) => onChange({ ...value, description: event.target.value })}
            placeholder="Add event context for guests and production teams."
            value={value.description}
          />
        </label>

        <Input
          error={errors.coverImageUrl}
          helperText="Optional image URL for the event cover."
          label="Cover image URL"
          onChange={(event) => onChange({ ...value, coverImageUrl: event.target.value })}
          placeholder="https://..."
          type="url"
          value={value.coverImageUrl}
        />

        <Input
          error={errors.qrExpiresAt}
          helperText="Optional expiry for guest upload access."
          label="QR expiry"
          onChange={(event) => onChange({ ...value, qrExpiresAt: event.target.value })}
          type="datetime-local"
          value={value.qrExpiresAt}
        />
      </CardContent>
    </Card>
  );
}
