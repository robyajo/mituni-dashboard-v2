"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getWilayahProvinces, PROVINCES_KEY } from "@/hooks/use-wilayah";

interface Province {
  id: string;
  name: string;
}

interface SelectProvinceProps {
  value?: string;
  onValueChange: (value: string, name: string) => void;
  initialName?: string;
  disabled?: boolean;
}

export function SelectProvince({
  value,
  onValueChange,
  initialName,
  disabled,
}: SelectProvinceProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");

  const { data: provincesData, isLoading } = useQuery({
    queryKey: PROVINCES_KEY,
    queryFn: getWilayahProvinces,
  });

  const provinces: Province[] = useMemo(
    () => provincesData?.data || [],
    [provincesData],
  );

  // Set initial label if provided
  useEffect(() => {
    if (initialName && !label) {
      setLabel(initialName);
      setQuery(initialName);
    }
  }, [initialName, label]);

  // Update label when value matches a province
  useEffect(() => {
    if (value && provinces.length > 0) {
      const p = provinces.find((x) => String(x.id) === String(value));
      if (p) {
        setLabel(p.name);
        setQuery(p.name);
      }
    }
  }, [value, provinces]);

  const filteredProvinces = useMemo(() => {
    return query === ""
      ? provinces
      : provinces.filter((province) =>
          province.name.toLowerCase().includes(query.toLowerCase()),
        );
  }, [query, provinces]);

  return (
    <Combobox
      value={value}
      onValueChange={(val) => {
        if (val) {
          const p = provinces.find((x) => String(x.id) === String(val));
          if (p) {
            setLabel(p.name);
            setQuery(p.name);
            onValueChange(val, p.name);
          }
          setOpen(false);
        }
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput
        placeholder={isLoading ? "Memuat provinsi..." : "Pilih Provinsi..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled || isLoading}
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredProvinces.length === 0 && !isLoading && (
            <ComboboxEmpty>Provinsi tidak ditemukan</ComboboxEmpty>
          )}
          {filteredProvinces.map((province) => (
            <ComboboxItem key={province.id} value={String(province.id)}>
              {province.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
