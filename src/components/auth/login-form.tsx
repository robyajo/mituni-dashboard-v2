"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/input/input-password";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useOutletStore } from "@/store/useOutletStore";
import { useFreeze } from "@/lib/use-freeze";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useDashboardFilterStore } from "@/store/useDashboardFilterStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthData, clearAuth } = useOutletStore();
  const { resetFilter } = useDashboardFilterStore();
  const { isFrozen, setFreezeUntil } = useFreeze("login_attempts", 5, 5 * 60);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isFrozen) {
      toast.error(
        "Akun terkunci sementara karena terlalu banyak percobaan gagal. Silakan coba lagi nanti.",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // const cookieConsent = localStorage.getItem("cookie-consent");
      // if (cookieConsent) {
      //   localStorage.setItem("cookie-consent", cookieConsent);
      // }
      // if (typeof window !== "undefined") {
      //   const cookies = document.cookie.split(";");
      //   for (const cookie of cookies) {
      //     const [rawName] = cookie.split("=");
      //     const name = rawName?.trim();
      //     if (!name) continue;
      //     document.cookie = `${name}=; path=/; max-age=0`;
      //   }
      // }

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        // URL yang dituju setelah login berhasil; "/" berarti halaman utama/dashboard
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(result.error);
        setError(result.error);
        setIsLoading(false);
      } else {
        // Get the session data which contains the outlet_id_active
        const sessionResponse = await fetch("/api/auth/session");
        const sessionData = await sessionResponse.json();

        const outletIdFromSession =
          sessionData?.data?.user?.outlet_id_active ??
          sessionData?.data?.outlet_id_active;

        clearAuth();
        resetFilter();
        if (typeof window !== "undefined") {
          const cookieConsent = localStorage.getItem("cookie-consent");
          localStorage.clear();
          if (cookieConsent) {
            localStorage.setItem("cookie-consent", cookieConsent);
          }

          const cookies = document.cookie.split(";");
          const allowList = [
            "cookie-consent",
            "next-auth.session-token",
            "__Secure-next-auth.session-token",
            "next-auth.callback-url",
            "next-auth.csrf-token",
          ];

          for (const cookie of cookies) {
            const [rawName] = cookie.split("=");
            const name = rawName?.trim();
            if (!name) continue;
            if (allowList.includes(name) || name.startsWith("next-auth.")) {
              continue;
            }
            document.cookie = `${name}=; path=/; max-age=0`;
          }
        }

        if (outletIdFromSession) {
          setAuthData({
            outlet_id_active: outletIdFromSession.toString(),
            // outlet_id_active: "16",
          });
        }

        // Login success, reset freeze
        setFreezeUntil(null);
        toast.success("Login successful");

        // Clear all query cache to ensure fresh data
        queryClient.clear();

        router.replace("/");
        // NOTE: Do NOT set isLoading(false) here to prevent user from double-clicking
        // while redirect is happening.
      }
    } catch {
      toast.error("An error occurred during login. Please try again.");
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="h-full w-full bg-gray-400 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 dark:bg-zinc-900 dark:bg-opacity-30 dark:border-zinc-800">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Selamat Datang Kembali</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masuk ke Dashboard Mituni
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {error && (
                <Alert variant="destructive" className="relative">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="pr-12">{error}</AlertDescription>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0"
                    onClick={() => setError(null)}
                  >
                    <span className="sr-only">Tutup</span>×
                  </Button>
                </Alert>
              )}

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="nama@contoh.com"
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                            required
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <Label>Password</Label>
                        <a
                          href="#"
                          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Lupa password?
                        </a>
                      </div>
                      <FormControl>
                        <InputPassword
                          placeholder="Masukkan password"
                          {...field}
                          disabled={isLoading}
                          required
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
                <FieldDescription className="text-center">
                  Belum memiliki akun?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Daftar sekarang
                  </Link>
                </FieldDescription>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Dengan mengklik masuk, Anda menyetujui{" "}
        <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a>{" "}
        kami.
      </div>
    </div>
  );
}
