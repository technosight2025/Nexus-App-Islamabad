"use client";

import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui";

interface UploadButtonProps {
  accept?: string;
  isUploading?: boolean;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

export function UploadButton({
  accept = "image/*,video/*",
  isUploading = false,
  multiple = true,
  onFilesSelected,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onFilesSelected?.(files);
    }

    event.target.value = "";
  }

  return (
    <div className="grid gap-2">
      <input
        accept={accept}
        className="sr-only"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <Button
        className="h-12 w-full shadow-md sm:w-auto"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {isUploading ? "Uploading..." : "Upload memories"}
      </Button>
      <p className="text-center text-xs text-muted sm:text-left">Photos and videos from your phone are supported.</p>
    </div>
  );
}
