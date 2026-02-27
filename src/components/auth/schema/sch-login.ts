import { z } from "zod";

const requiredString = z.string().trim().min(1, "Harus diisi");

export const loginSchema = z.object({
  email: requiredString.email("Alamat email tidak valid"),
  password: requiredString.min(6, "Password harus minimal 8 karakter"),
});
export type AuthLoginValues = z.infer<typeof loginSchema>;