import { z } from "zod";

export const accountSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
    phone_number: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^\d+$/, "Nomor telepon harus berupa angka"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmation_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "Password tidak cocok",
    path: ["confirmation_password"],
  });

export const brandSchema = z.object({
  name_brand: z.string().min(1, "Nama brand wajib diisi"),
});

export const locationSchema = z.object({
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kota: z.string().min(1, "Kota wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
});

export const registerSchema = z.intersection(
  z.intersection(accountSchema, brandSchema),
  locationSchema
);

export type AccountFormValues = z.infer<typeof accountSchema>;
export type BrandFormValues = z.infer<typeof brandSchema>;
export type LocationFormValues = z.infer<typeof locationSchema>;
export type AuthRegisterValues = z.infer<typeof registerSchema>;
