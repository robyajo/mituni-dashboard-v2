import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  phone_number: z.string().min(1, "Nomor HP wajib diisi"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  foto: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Password lama wajib diisi"),
    new_password: z.string().min(6, "Password baru minimal 6 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
