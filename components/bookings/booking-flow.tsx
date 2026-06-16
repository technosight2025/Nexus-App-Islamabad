"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useConfirmBooking, useCreateBooking } from "@/modules/bookings/hooks";
import type { Booking, BookingPricingSummary } from "@/modules/bookings/types";
import { useMarketplaceListing } from "@/modules/marketplace/hooks";

interface BookingFlowProps {
  listingId: string;
}

interface BookingPackage {
  id: string;
  name: string;
  blurb: string;
  price: number;
}

interface EventDetailsForm {
  title: string;
  type: string;
  venue: string;
  city: string;
  eventDate: string;
  guestCount: string;
  notes: string;
}

type StepId = "package" | "details" | "review";

const STEPS: { id: StepId; label: string }[] = [
  { id: "package", label: "Package" },
  { id: "details", label: "Event details" },
  { id: "review", label: "Review & confirm" },
];

const EVENT_TYPES = ["Wedding", "Engagement", "Corporate", "Birthday", "Product shoot", "Other"];

const priceFormatter = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
});

function buildPackages(basePrice: number): BookingPackage[] {
  return [
    { id: "pkg-essential", name: "Essential", blurb: "Core coverage for focused events.", price: basePrice },
    {
      id: "pkg-signature",
      name: "Signature",
      blurb: "Extended hours with highlight delivery.",
      price: Math.round(basePrice * 1.4),
    },
    {
      id: "pkg-premium",
      name: "Premium",
      blurb: "Full-day coverage with premium deliverables.",
      price: Math.round(basePrice * 1.9),
    },
  ];
}

function computePricing(subtotal: number): BookingPricingSummary {
  const platformFee = Math.round(subtotal * 0.05);
  const taxAmount = 0;
  const discountAmount = 0;
  const depositAmount = Math.round(subtotal * 0.3);

  return {
    subtotal,
    platformFee,
    taxAmount,
    discountAmount,
    depositAmount,
    totalAmount: subtotal + platformFee + taxAmount - discountAmount,
    currency: "PKR",
  };
}

export function BookingFlow({ listingId }: BookingFlowProps) {
  const listingQuery = useMarketplaceListing(listingId);
  const createBooking = useCreateBooking();
  const confirmBooking = useConfirmBooking();

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState<string>();
  const [confirmedBooking, setConfirmedBooking] = useState<Booking>();
  const [submitError, setSubmitError] = useState<string>();
  const [form, setForm] = useState<EventDetailsForm>({
    title: "",
    type: EVENT_TYPES[0],
    venue: "",
    city: "",
    eventDate: "",
    guestCount: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EventDetailsForm, string>>>({});

  const listing = listingQuery.data;
  const packages = useMemo(() => (listing ? buildPackages(listing.basePrice) : []), [listing]);
  const selectedPackage = packages.find((item) => item.id === selectedPackageId);
  const pricing = selectedPackage ? computePricing(selectedPackage.price) : undefined;

  if (listingQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-6 w-1/2 animate-pulse rounded-full bg-muted-surface" />
        </CardContent>
      </Card>
    );
  }

  if (listingQuery.error || !listing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listing unavailable</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted">
            {listingQuery.error?.message ?? "We could not load this listing to start a booking."}
          </p>
          <Link href="/marketplace">
            <Button variant="secondary">Back to marketplace</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} listingTitle={listing.title} />;
  }

  const currentStep = STEPS[stepIndex];

  function handleFieldChange(field: keyof EventDetailsForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function validateDetails() {
    const errors: Partial<Record<keyof EventDetailsForm, string>> = {};

    if (!form.title.trim()) {
      errors.title = "Event title is required.";
    }

    if (!form.type.trim()) {
      errors.type = "Event type is required.";
    }

    if (!form.venue.trim()) {
      errors.venue = "Venue is required.";
    }

    if (!form.city.trim()) {
      errors.city = "City is required.";
    }

    if (!form.eventDate) {
      errors.eventDate = "Event date is required.";
    }

    if (form.guestCount) {
      const parsed = Number(form.guestCount);
      if (!Number.isInteger(parsed) || parsed < 1) {
        errors.guestCount = "Guest count must be a positive whole number.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function goNext() {
    setSubmitError(undefined);

    if (currentStep.id === "package") {
      if (!selectedPackageId) {
        setSubmitError("Select a package to continue.");
        return;
      }
      setStepIndex(1);
      return;
    }

    if (currentStep.id === "details") {
      if (!validateDetails()) {
        return;
      }
      setStepIndex(2);
    }
  }

  function goBack() {
    setSubmitError(undefined);
    setStepIndex((previous) => Math.max(0, previous - 1));
  }

  async function handleConfirm() {
    if (!listing || !selectedPackage || !pricing) {
      setSubmitError("Select a package to continue.");
      return;
    }

    setSubmitError(undefined);

    try {
      const eventDate = new Date(`${form.eventDate}T12:00:00.000Z`).toISOString();
      const created = await createBooking.mutateAsync({
        tenantId: "tenant-nexus",
        clientId: "client-demo",
        listingId: listing.id,
        professionalId: listing.ownerId,
        serviceId: `svc-${listing.id}`,
        packageId: selectedPackage.id,
        eventDate,
        eventDetails: {
          title: form.title.trim(),
          type: form.type.trim(),
          venue: form.venue.trim(),
          city: form.city.trim(),
          guestCount: form.guestCount ? Number(form.guestCount) : undefined,
          notes: form.notes.trim() ? form.notes.trim() : undefined,
        },
        pricing,
      });

      const confirmed = await confirmBooking.mutateAsync({
        bookingId: created.id,
        paymentIntentId: `demo_pi_${created.id}`,
      });

      setConfirmedBooking(confirmed);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not complete the booking. Please try again.");
    }
  }

  const isSubmitting = createBooking.isPending || confirmBooking.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="grid gap-6">
        <StepIndicator activeIndex={stepIndex} />

        {currentStep.id === "package" ? (
          <Card>
            <CardHeader>
              <CardTitle>Choose a package</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {packages.map((item) => {
                const isSelected = item.id === selectedPackageId;
                return (
                  <button
                    className={`grid gap-1 rounded-2xl border p-4 text-left transition-colors ${
                      isSelected ? "border-accent bg-accent/5" : "border-border hover:bg-muted-surface"
                    }`}
                    key={item.id}
                    onClick={() => setSelectedPackageId(item.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-foreground">{item.name}</span>
                      <span className="text-base font-bold text-foreground">{priceFormatter.format(item.price)}</span>
                    </div>
                    <span className="text-sm text-muted">{item.blurb}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ) : null}

        {currentStep.id === "details" ? (
          <Card>
            <CardHeader>
              <CardTitle>Event details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                error={fieldErrors.title}
                label="Event title"
                onChange={(event) => handleFieldChange("title", event.target.value)}
                placeholder="e.g. Khan Wedding Reception"
                value={form.title}
              />
              <label className="grid gap-2 text-sm font-medium text-foreground">
                <span>Event type</span>
                <select
                  className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                  onChange={(event) => handleFieldChange("type", event.target.value)}
                  value={form.type}
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  error={fieldErrors.venue}
                  label="Venue"
                  onChange={(event) => handleFieldChange("venue", event.target.value)}
                  placeholder="e.g. Serena Hotel"
                  value={form.venue}
                />
                <Input
                  error={fieldErrors.city}
                  label="City"
                  onChange={(event) => handleFieldChange("city", event.target.value)}
                  placeholder="e.g. Islamabad"
                  value={form.city}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  error={fieldErrors.eventDate}
                  label="Event date"
                  onChange={(event) => handleFieldChange("eventDate", event.target.value)}
                  type="date"
                  value={form.eventDate}
                />
                <Input
                  error={fieldErrors.guestCount}
                  helperText="Optional"
                  label="Guest count"
                  min={1}
                  onChange={(event) => handleFieldChange("guestCount", event.target.value)}
                  placeholder="e.g. 250"
                  type="number"
                  value={form.guestCount}
                />
              </div>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                <span>Notes</span>
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
                  onChange={(event) => handleFieldChange("notes", event.target.value)}
                  placeholder="Share anything the professional should know (optional)."
                  value={form.notes}
                />
              </label>
            </CardContent>
          </Card>
        ) : null}

        {currentStep.id === "review" ? (
          <Card>
            <CardHeader>
              <CardTitle>Review &amp; confirm</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <SummaryRow label="Service" value={listing.title} />
              <SummaryRow label="Professional" value={listing.professionalName} />
              <SummaryRow label="Package" value={selectedPackage ? selectedPackage.name : "-"} />
              <SummaryRow label="Event" value={`${form.title} (${form.type})`} />
              <SummaryRow label="Venue" value={`${form.venue}, ${form.city}`} />
              <SummaryRow label="Date" value={formatDate(form.eventDate)} />
              {form.guestCount ? <SummaryRow label="Guests" value={form.guestCount} /> : null}
              {form.notes ? <SummaryRow label="Notes" value={form.notes} /> : null}
            </CardContent>
          </Card>
        ) : null}

        {submitError ? (
          <p className="text-sm font-medium text-danger" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <Button disabled={isSubmitting} onClick={goBack} variant="secondary">
              Back
            </Button>
          ) : (
            <Link href={`/listings/${listing.id}`}>
              <Button variant="ghost">Cancel</Button>
            </Link>
          )}

          {currentStep.id === "review" ? (
            <Button disabled={isSubmitting} onClick={handleConfirm}>
              {isSubmitting ? "Confirming..." : "Confirm booking"}
            </Button>
          ) : (
            <Button onClick={goNext}>Continue</Button>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Service</span>
              <span className="text-right font-medium text-foreground">{listing.title}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Package</span>
              <span className="font-medium text-foreground">{selectedPackage ? selectedPackage.name : "Not selected"}</span>
            </div>
            {pricing ? (
              <div className="grid gap-2 border-t border-border pt-3">
                <PriceRow label="Subtotal" value={pricing.subtotal} />
                <PriceRow label="Platform fee" value={pricing.platformFee} />
                <PriceRow label="Deposit due now" value={pricing.depositAmount} />
                <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{priceFormatter.format(pricing.totalAmount)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">Select a package to see pricing.</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function StepIndicator({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-3 text-sm">
      {STEPS.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        return (
          <li className="flex items-center gap-2" key={step.id}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isActive || isComplete ? "bg-primary text-primary-foreground" : "bg-muted-surface text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span className={isActive ? "font-semibold text-foreground" : "text-muted"}>{step.label}</span>
            {index < STEPS.length - 1 ? <span className="text-muted">/</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

function BookingConfirmation({ booking, listingTitle }: { booking: Booking; listingTitle: string }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle>Booking confirmed</CardTitle>
            <Badge variant="success">{booking.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <p className="text-muted">
            Your booking for <span className="font-semibold text-foreground">{listingTitle}</span> is confirmed.
          </p>
          <SummaryRow label="Booking ID" value={booking.id} />
          <SummaryRow label="Status" value={booking.status} />
          <SummaryRow label="Payment" value={booking.paymentStatus} />
          <SummaryRow label="Event" value={`${booking.eventDetails.title} (${booking.eventDetails.type})`} />
          <SummaryRow label="Venue" value={`${booking.eventDetails.venue}, ${booking.eventDetails.city}`} />
          <SummaryRow label="Date" value={formatDate(booking.eventDate)} />
          <div className="grid gap-2 border-t border-border pt-3">
            <PriceRow label="Subtotal" value={booking.pricing.subtotal} />
            <PriceRow label="Platform fee" value={booking.pricing.platformFee} />
            <PriceRow label="Deposit paid" value={booking.pricing.depositAmount} />
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                {priceFormatter.format(booking.pricing.totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Link href="/marketplace">
          <Button>Browse more services</Button>
        </Link>
        <Link href={`/listings/${booking.listingId}`}>
          <Button variant="secondary">Back to listing</Button>
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{priceFormatter.format(value)}</span>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value.length === 10 ? `${value}T12:00:00.000Z` : value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
