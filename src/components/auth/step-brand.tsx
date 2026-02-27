"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Phone, MapPin } from "lucide-react";
import { AuthRegisterValues } from "./schema/sch-register";
import NumberInput from "../input/number-input";
import { SelectCity } from "../select/select-city";
import { SelectProvince } from "../select/select-province";

export function BrandStep({ isLoading }: { isLoading: boolean }) {
  const { control, watch, setValue, trigger } =
    useFormContext<AuthRegisterValues>();
  const selectedProvinceId = watch("provinsi");

  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <FormField
        control={control}
        name="name_brand"
        render={({ field }) => (
          <FormItem>
            <Label suppressHydrationWarning>
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative" suppressHydrationWarning>
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Brand Name"
                  className="pl-10"
                  {...field}
                  disabled={isLoading}
                  required
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" suppressHydrationWarning />
          </FormItem>
        )}
      />

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="provinsi"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>
                Provinsi <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <SelectProvince
                  value={field.value}
                  onValueChange={(val: string) => {
                    field.onChange(val);
                    setValue("kota", "", { shouldValidate: true });
                    trigger("provinsi");
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="kota"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>
                Kota <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <SelectCity
                  provinceId={selectedProvinceId}
                  value={field.value}
                  onValueChange={(val: string) => {
                    field.onChange(val);
                    trigger("kota");
                  }}
                  disabled={isLoading || !selectedProvinceId}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <Label suppressHydrationWarning>
              Address <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative" suppressHydrationWarning>
                <Textarea
                  placeholder="Full Address"
                  rows={4}
                  {...field}
                  disabled={isLoading}
                  required
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" suppressHydrationWarning />
          </FormItem>
        )}
      />
    </div>
  );
}
