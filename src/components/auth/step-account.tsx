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
import { PasswordInput } from "@/components/ui/password-input";
import { User, Mail, Lock } from "lucide-react";
import { AuthRegisterValues } from "./schema/sch-register";
import NumberInput from "../input/number-input";

export function AccountStep({ isLoading }: { isLoading: boolean }) {
  const { control } = useFormContext<AuthRegisterValues>();
  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <Label suppressHydrationWarning>
              Name <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative" suppressHydrationWarning>
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Full Name"
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
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10"
                  {...field}
                  disabled={isLoading}
                  required
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <Label>
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative" suppressHydrationWarning>
                <NumberInput
                  nama_field={"phone_number"}
                  nama_input={"Phone Number"}
                  is_required={true}
                  value={field.value?.toString() || ""}
                  onChange={(value) => field.onChange(value)}
                  placeholder={"Phone Number"}
                  min={10}
                  max={13}
                  digits={13}
                  disabled={isLoading}
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" suppressHydrationWarning />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="password"
                  placeholder="Password"
                  className="pl-10"
                  {...field}
                  disabled={isLoading}
                  required
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmation_password"
        render={({ field }) => (
          <FormItem>
            <Label suppressHydrationWarning>
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <FormControl>
              <div className="relative" suppressHydrationWarning>
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="confirmation_password"
                  placeholder="Confirm Password"
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
    </div>
  );
}
