"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type FileInfo = {
  name?: string;
  preview?: string;
  fieldName: string;
};

type DebugFormProps<T extends Record<string, any>> = {
  /** The form instance from react-hook-form */
  form: UseFormReturn<T>;
  /** Current form mode (create/edit) */
  mode?: "store" | "update";
  /** ID of the item being edited (for edit mode) */
  id?: string | number;
  /** Additional debug information to display */
  extraInfo?: Record<string, any>;
  /** Information about file uploads to track */
  files?: FileInfo[];
  /** Whether to show the debug panel */
  show?: boolean;
};

export function DebugForm<T extends Record<string, any>>({
  form,
  mode,
  id,
  extraInfo = {},
  files = [],
  show = process.env.NODE_ENV === "development",
}: DebugFormProps<T>) {
  // Don't render anything in production or if explicitly hidden
  if (!show) return null;

  // Get all form values
  const formValues = form.watch();

  // Prepare file info
  const fileStatus = files.reduce<Record<string, any>>((acc, file) => {
    const value = form.watch(file.fieldName as any);
    const isFile =
      value && typeof value === "object" && "name" in value && "type" in value;

    return {
      ...acc,
      [file.fieldName]: {
        fileName: file.name || "No file selected",
        preview: file.preview ? "Preview available" : "No preview",
        formValue: isFile ? `[File] ${(value as File).name}` : value,
      },
    };
  }, {});

  const debugData = {
    formValues,
    mode,
    id: mode === "update" ? id : "new",
    ...extraInfo,
    ...(files.length > 0 && { fileStatus }),
  };

  const copyDebugInfo = () => {
    const text = JSON.stringify(
      debugData,
      (key, value) => {
        if (typeof value === "function") return "[Function]";
        if (value instanceof File) return `[File] ${value.name}`;
        if (value instanceof Blob) return "[Blob]";
        return value;
      },
      2
    );
    navigator.clipboard.writeText(text).then(() => {
      // Optional: show toast or change button text
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-card/30 rounded p-3 mt-4 text-xs font-mono scale-100">
      <div className="mb-1 font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between">
        <span>Debug Information</span>
        <button
          onClick={copyDebugInfo}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[10px] leading-none"
        >
          Copy
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-all text-[10px] leading-tight overflow-y-auto max-h-25">
        {JSON.stringify(
          debugData,
          (key, value) => {
            // Handle circular references and functions
            if (typeof value === "function") return "[Function]";
            if (value instanceof File) return `[File] ${value.name}`;
            if (value instanceof Blob) return "[Blob]";
            return value;
          },
          2
        )}
      </pre>
    </div>
  );
}

// Default export for backward compatibility
export default DebugForm;
