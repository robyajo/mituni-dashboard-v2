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
import { CITIES_KEY, getWilayahCities } from "@/hooks/use-wilayah";

interface City {
  id: number;
  name: string;
  province_id: number;
}
interface SelectCityProps {
  provinceId?: string;
  value?: string;
  onValueChange: (value: string, name: string) => void;
  initialName?: string;
  disabled?: boolean;
}

export function SelectCity({
  provinceId,
  value,
  onValueChange,
  initialName,
  disabled,
}: SelectCityProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");

  const { data: citiesData, isLoading } = useQuery({
    queryKey: [...CITIES_KEY, provinceId],
    queryFn: () => getWilayahCities(provinceId!),
    enabled: !!provinceId,
  });

  const cities: City[] = useMemo(() => citiesData?.data || [], [citiesData]);

  // Set initial label if provided
  useEffect(() => {
    if (initialName && !label) {
      setLabel(initialName);
      setQuery(initialName);
    }
  }, [initialName, label]);

  // Update label when value matches a city
  useEffect(() => {
    if (value && cities.length > 0) {
      const c = cities.find((x) => String(x.id) === String(value));
      if (c) {
        setLabel(c.name);
        setQuery(c.name);
      }
    }
  }, [value, cities]);

  // Reset if province changes and current value is not in new cities
  useEffect(() => {
    if (provinceId && cities.length > 0 && value) {
      const exists = cities.some((x) => String(x.id) === String(value));
      if (!exists && !initialName) {
        // Only reset if it's not the initial load with an initial name
        // This is tricky because we don't want to reset during hydration
      }
    }
  }, [provinceId, cities, value, initialName]);

  const filteredCities = useMemo(() => {
    return query === ""
      ? cities
      : cities.filter((city) =>
          city.name.toLowerCase().includes(query.toLowerCase()),
        );
  }, [query, cities]);

  return (
    <Combobox
      value={value}
      onValueChange={(val) => {
        if (val) {
          const c = cities.find((x) => String(x.id) === String(val));
          if (c) {
            setLabel(c.name);
            setQuery(c.name);
            onValueChange(val, c.name);
          }
          setOpen(false);
        }
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput
        placeholder={
          !provinceId
            ? "Pilih provinsi terlebih dahulu"
            : isLoading
              ? "Memuat kota..."
              : "Pilih Kota..."
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled || isLoading || !provinceId}
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredCities.length === 0 && !isLoading && provinceId && (
            <ComboboxEmpty>Kota tidak ditemukan</ComboboxEmpty>
          )}
          {!provinceId && (
            <ComboboxEmpty>Pilih provinsi terlebih dahulu</ComboboxEmpty>
          )}
          {filteredCities.map((city) => (
            <ComboboxItem key={city.id} value={String(city.id)}>
              {city.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
