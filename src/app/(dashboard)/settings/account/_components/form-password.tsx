"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePassword } from "../api";
import { ChangePasswordSchema, changePasswordSchema } from "./schema";
import { Loader2 } from "lucide-react";
import { InputPassword } from "@/components/input/input-password";

export default function FormPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordSchema> = async (data) => {
    setIsLoading(true);
    try {
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      toast.success("Password berhasil diperbarui");
      form.reset();
    } catch (err) {
      console.error(err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message ||
          (err instanceof Error ? err.message : "Gagal mengubah password"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Lama</FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="******"
                    {...field}
                    showIcon={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="******"
                    {...field}
                    showIcon={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password Baru</FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="******"
                    {...field}
                    showIcon={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ubah Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
