import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NumberInputProps {
  nama_field: string;
  nama_input: string;
  desc_field?: string;
  is_required?: boolean;
  value?: string | number;
  onChange: (value: string, field: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  error?: string | null;
  digits?: number; // jumlah digit tetap, misal 2 untuk 'digits:2'
  disabled?: boolean;
}

export default function NumberInput({
  nama_field,
  nama_input,
  desc_field,
  is_required = false,
  value = "",
  onChange,
  placeholder,
  min,
  max,
  error: externalError,
  digits,
  disabled = false,
}: NumberInputProps) {
  const [error, setError] = useState<string | null>(null);

  const isPhoneField =
    /hp|phone|wa|telp|mobile|contact|whatsapp/i.test(nama_field) ||
    /hp|phone|wa|telp|mobile|contact|whatsapp/i.test(nama_input);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Remove '+' if it exists (for phone fields display)
    if (isPhoneField && val.startsWith("+")) {
      val = val.substring(1);
    }

    // Auto-replace 08 -> 628 for phone fields
    if (isPhoneField && val.startsWith("0")) {
      val = "62" + val.substring(1);
    }

    // Hanya angka dan string kosong
    if (val !== "" && !/^\d+$/.test(val)) {
      setError("Hanya boleh angka");
      return;
    }
    if (is_required && val.trim() === "") {
      setError("Field wajib diisi");
      onChange(val, nama_field);
      return;
    }
    // Validasi digits: hanya error jika length > digits
    if (digits && val.length > digits) {
      setError(`Maksimal ${digits} digit`);
      return;
    }
    setError(null);
    onChange(val, nama_field);
  };

  return (
    <>
      {/* <Label htmlFor={nama_field}>
        {nama_input} {is_required && <span className="text-red-500">*</span>}{" "}
        {(error || externalError) && (
          <p className="text-xs text-red-500 mt-1">{error || externalError}</p>
        )}
      </Label> */}
      {/* {desc_field && (
        <p className="text-xs text-muted-foreground mb-1">{desc_field}</p>
      )} */}
      <Input
        type="text"
        inputMode="numeric"
        id={nama_field}
        name={nama_field}
        required={is_required}
        value={
          isPhoneField && String(value).startsWith("62") ? `+${value}` : value
        }
        onChange={handleChange}
        placeholder={placeholder || nama_input}
        min={min}
        max={max}
        disabled={disabled}
        className={`${error || externalError ? "border-red-500" : ""} ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        autoComplete="off"
      />
    </>
  );
}
