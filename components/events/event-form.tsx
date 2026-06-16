"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { EventSettings, type EventSettingsValue } from "@/components/events/event-settings";
import { QRCodeGenerator } from "@/components/events/qr-code-generator";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";
import { useCreateEvent, useGenerateEventQRCode } from "@/modules/events/hooks";
import type { CreateEventInput, Event, QRCode } from "@/modules/events/types";

interface EventFormProps {
  tenantId: string;
  ownerId: string;
  onCreated?: (event: Event, qrCode?: QRCode) => void;
}

interface EventFormValue {
  title: string;
  venue: string;
  city: string;
  eventDate: string;
}

type EventFormErrors = Partial<Record<keyof EventFormValue | keyof EventSettingsValue | "form", string>>;

const initialEventValue: EventFormValue = {
  title: "",
  venue: "",
  city: "",
  eventDate: "",
};

const initialSettingsValue: EventSettingsValue = {
  description: "",
  coverImageUrl: "",
  qrExpiresAt: "",
};

export function EventForm({ tenantId, ownerId, onCreated }: EventFormProps) {
  const [eventValue, setEventValue] = useState<EventFormValue>(initialEventValue);
  const [settingsValue, setSettingsValue] = useState<EventSettingsValue>(initialSettingsValue);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [createdEvent, setCreatedEvent] = useState<Event>();
  const [qrCode, setQRCode] = useState<QRCode>();
  const createEvent = useCreateEvent();
  const generateQRCode = useGenerateEventQRCode();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(eventValue, settingsValue);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const payload = buildCreateEventPayload(tenantId, ownerId, eventValue, settingsValue);
      const nextEvent = await createEvent.mutateAsync(payload);
      const nextQRCode = await generateQRCode.mutateAsync({
        eventId: nextEvent.id,
        expiresAt: normalizeOptionalValue(settingsValue.qrExpiresAt),
      });

      setCreatedEvent(nextEvent);
      setQRCode(nextQRCode);
      onCreated?.(nextEvent, nextQRCode);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Unable to create event.",
      });
    }
  }

  async function handleGenerateQRCode() {
    if (!createdEvent) {
      return;
    }

    try {
      const nextQRCode = await generateQRCode.mutateAsync({
        eventId: createdEvent.id,
        expiresAt: normalizeOptionalValue(settingsValue.qrExpiresAt),
      });
      setQRCode(nextQRCode);
      onCreated?.(createdEvent, nextQRCode);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Unable to generate QR code.",
      });
    }
  }

  const isSubmitting = createEvent.isPending || generateQRCode.isPending;

  return (
    <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create event</CardTitle>
            <CardDescription>Set up Event Memories and automatically generate guest upload access.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              error={errors.title}
              label="Event title"
              onChange={(event) => setEventValue({ ...eventValue, title: event.target.value })}
              placeholder="Khan Wedding Reception"
              value={eventValue.title}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                error={errors.venue}
                label="Venue"
                onChange={(event) => setEventValue({ ...eventValue, venue: event.target.value })}
                placeholder="Serena Hotel"
                value={eventValue.venue}
              />
              <Input
                error={errors.city}
                label="City"
                onChange={(event) => setEventValue({ ...eventValue, city: event.target.value })}
                placeholder="Islamabad"
                value={eventValue.city}
              />
            </div>
            <Input
              error={errors.eventDate}
              label="Event date and time"
              onChange={(event) => setEventValue({ ...eventValue, eventDate: event.target.value })}
              type="datetime-local"
              value={eventValue.eventDate}
            />
            {errors.form ? <p className="text-sm font-medium text-danger">{errors.form}</p> : null}
          </CardContent>
        </Card>

        <EventSettings
          errors={{
            coverImageUrl: errors.coverImageUrl,
            qrExpiresAt: errors.qrExpiresAt,
          }}
          onChange={setSettingsValue}
          value={settingsValue}
        />
      </div>

      <aside className="grid content-start gap-4 lg:sticky lg:top-24">
        <QRCodeGenerator
          canGenerate={Boolean(createdEvent)}
          errorMessage={generateQRCode.error?.message}
          isGenerating={generateQRCode.isPending}
          onGenerate={handleGenerateQRCode}
          qrCode={qrCode}
        />

        <Card>
          <CardContent className="grid gap-3 p-4">
            <Button disabled={isSubmitting} size="lg" type="submit">
              {isSubmitting ? "Creating event..." : "Create event and QR"}
            </Button>
            <p className="text-center text-xs leading-5 text-muted">
              QR upload access is generated automatically after the event is saved.
            </p>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}

function validateForm(eventValue: EventFormValue, settingsValue: EventSettingsValue) {
  const errors: EventFormErrors = {};

  if (!eventValue.title.trim()) {
    errors.title = "Event title is required.";
  }

  if (!eventValue.venue.trim()) {
    errors.venue = "Venue is required.";
  }

  if (!eventValue.city.trim()) {
    errors.city = "City is required.";
  }

  if (!eventValue.eventDate.trim()) {
    errors.eventDate = "Event date is required.";
  }

  if (settingsValue.coverImageUrl.trim() && !isValidUrl(settingsValue.coverImageUrl)) {
    errors.coverImageUrl = "Cover image must be a valid URL.";
  }

  if (settingsValue.qrExpiresAt && Date.parse(settingsValue.qrExpiresAt) <= Date.now()) {
    errors.qrExpiresAt = "QR expiry must be in the future.";
  }

  return errors;
}

function buildCreateEventPayload(
  tenantId: string,
  ownerId: string,
  eventValue: EventFormValue,
  settingsValue: EventSettingsValue,
): CreateEventInput {
  return {
    tenantId,
    ownerId,
    title: eventValue.title.trim(),
    venue: eventValue.venue.trim(),
    city: eventValue.city.trim(),
    eventDate: new Date(eventValue.eventDate).toISOString(),
    description: normalizeOptionalValue(settingsValue.description),
    coverImageUrl: normalizeOptionalValue(settingsValue.coverImageUrl),
  };
}

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
