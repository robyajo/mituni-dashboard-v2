"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api";
import { ProfileSchema, profileSchema } from "./schema";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { getProfile, PROFILE_KEY } from "@/hooks/use-profile-verified";
import NumberInput from "@/components/input/number-input";

export default function FormProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isLoadingData } = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
    },
  });

  useEffect(() => {
    if (profileData?.data) {
      const data = profileData.data;
      form.reset({
        name: data.name,
        phone_number: data.phone_number,
        email: data.email,
      });
      if (data.photo_url) {
        setPreviewImage(data.photo_url);
      }
    }
  }, [profileData, form]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileSchema> = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone_number", data.phone_number);
      if (data.foto instanceof File) {
        formData.append("foto", data.foto);
      }

      await updateProfile(formData);
      toast.success("Profile berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    } catch (err) {
      console.error(err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError.response?.data?.message ||
          (err instanceof Error ? err.message : "Gagal memperbarui profile"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP</FormLabel>
                <FormControl>
                  <NumberInput
                    nama_field={field.name}
                    nama_input="No. HP"
                    placeholder="08..."
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={form.formState.errors.phone_number?.message}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foto"
            render={({ field: { value: _value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Foto Profil</FormLabel>
                <div className="flex flex-col gap-4">
                  {previewImage && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, onChange)}
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
}
