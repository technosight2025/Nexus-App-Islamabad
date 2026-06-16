"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { QRCode } from "@/modules/events/types";

interface QRCodeGeneratorProps {
  qrCode?: QRCode;
  isGenerating?: boolean;
  errorMessage?: string;
  canGenerate?: boolean;
  onGenerate?: () => void;
}

export function QRCodeGenerator({
  qrCode,
  isGenerating = false,
  errorMessage,
  canGenerate = false,
  onGenerate,
}: QRCodeGeneratorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Guest upload QR</CardTitle>
            <CardDescription>Automatically generated after event creation for Event Memories uploads.</CardDescription>
          </div>
          <Badge variant={qrCode ? "success" : "neutral"}>{qrCode ? "Ready" : "Pending"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 rounded-3xl border border-dashed border-border bg-muted-surface p-4 text-center">
          <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-3xl bg-card p-4 shadow-inner">
            {Array.from({ length: 25 }).map((_, index) => (
              <span
                className={index % 2 === 0 || index % 7 === 0 ? "rounded-sm bg-primary" : "rounded-sm bg-border"}
                key={index}
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {qrCode ? "QR code generated" : isGenerating ? "Generating QR code..." : "Create an event to generate QR"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {qrCode?.expiresAt ? `Expires ${formatDate(qrCode.expiresAt)}` : "Guest uploads can be reviewed later."}
            </p>
          </div>
        </div>

        {qrCode ? (
          <div className="grid gap-2 rounded-2xl bg-muted-surface p-3 text-sm">
            <span className="font-medium text-foreground">Upload URL</span>
            <span className="break-all text-muted">{qrCode.uploadUrl}</span>
          </div>
        ) : null}

        {errorMessage ? <p className="text-sm font-medium text-danger">{errorMessage}</p> : null}

        <Button disabled={!canGenerate || isGenerating} onClick={onGenerate} type="button" variant="secondary">
          {qrCode ? "Regenerate QR" : "Generate QR"}
        </Button>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
