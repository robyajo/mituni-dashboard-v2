"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputRupiahProps extends Omit<
  React.ComponentProps<"input">,
  "onChange" | "value"
> {
  value: string | number;
  onChange: (value: number) => void;
}

export default function InputRupiah({
  value,
  onChange,
  className,
  ...props
}: InputRupiahProps) {
  const [displayValue, setDisplayValue] = React.useState("");

  React.useEffect(() => {
    if (value === "" || value === undefined || value === null) {
      setDisplayValue("");
      return;
    }
    const numberVal = Number(value);
    if (!isNaN(numberVal)) {
      setDisplayValue(formatRupiah(numberVal));
    }
  }, [value]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Keep only digits
    const digits = rawValue.replace(/\D/g, "");

    if (digits === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    const numberValue = parseInt(digits, 10);
    onChange(numberValue);
  };

  return (
    <Input
      {...props}
      className={cn(className)}
      value={displayValue}
      onChange={handleChange}
    />
  );
}
