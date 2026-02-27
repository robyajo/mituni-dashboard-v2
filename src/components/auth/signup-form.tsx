"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import {
  accountSchema,
  brandSchema,
  locationSchema,
  AuthRegisterValues,
} from "@/components/auth/schema/sch-register";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  User,
  Store,
  MapPin,
  Building2,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { defineStepper } from "@stepperize/react";
import { AccountStep } from "@/components/auth/step-account";
import { BrandStep } from "@/components/auth/step-brand";
import { useAuthFormLimitStore } from "@/store/useAuthFormLimitStore";
import { useOutletStore } from "@/store/useOutletStore";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { signIn } from "next-auth/react";
import { DebugTools } from "@/components/tools/debug-tools";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ============================================================================
// DATA & METADATA
// ============================================================================

const STEPS_METADATA: Record<string, { icon: any; description: string }> = {
  account: {
    icon: User,
    description: "Detail akun & login",
  },
  brand: {
    icon: Store,
    description: "Identitas laundry",
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

function SidebarStep({
  step,
  isActive,
  isCompleted,
  isLast,
}: {
  step: { id: string; label: string };
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}) {
  const metadata = STEPS_METADATA[step.id] || { icon: User, description: "" };
  const Icon = metadata.icon;

  return (
    <div className="relative flex items-center gap-4 py-4">
      {/* Vertical Line */}
      {!isLast && (
        <div className="absolute left-6 top-10 h-full w-0.5 bg-border/30">
          <motion.div
            className="h-full w-full bg-primary"
            initial={{ height: "0%" }}
            animate={{ height: isCompleted ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Icon Bubble */}
      <motion.div
        className={cn(
          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : isActive
              ? "border-primary bg-background text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
              : "border-border/50 bg-background/50 text-muted-foreground",
        )}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </motion.div>

      {/* Text Info */}
      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-semibold transition-colors duration-300",
            isActive || isCompleted
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {step.label}
        </span>
        <span className="text-xs text-muted-foreground/70">
          {metadata.description}
        </span>
      </div>
    </div>
  );
}

function MobileStep({
  step,
  isActive,
  isCompleted,
  isLast,
}: {
  step: { id: string; label: string };
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}) {
  const metadata = STEPS_METADATA[step.id] || { icon: User, description: "" };
  const Icon = metadata.icon;

  return (
    <div className="flex flex-1 flex-col items-center relative">
      {/* Horizontal Line */}
      {!isLast && (
        <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border/30 -z-10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: isCompleted ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Icon Bubble */}
      <motion.div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : isActive
              ? "border-primary bg-background text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
              : "border-border/50 bg-background/50 text-muted-foreground",
        )}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </motion.div>

      {/* Text Info */}
      <span
        className={cn(
          "mt-2 text-xs font-semibold transition-colors duration-300 text-center",
          isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {step.label}
      </span>
    </div>
  );
}

const { useStepper, steps } = defineStepper(
  { id: "account", label: "Informasi Akun", schema: accountSchema },
  {
    id: "brand",
    label: "Brand & Lokasi",
    schema: brandSchema.merge(locationSchema),
  },
);

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const stepper = useStepper();

  const currentSchema = useMemo(
    () => stepper.state.current.data.schema,
    [stepper.state.current.data.id],
  );

  const form = useForm<AuthRegisterValues>({
    mode: "onTouched",
    resolver: zodResolver(
      currentSchema,
    ) as unknown as Resolver<AuthRegisterValues>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmation_password: "",
      phone_number: "",
      name_brand: "",
      provinsi: "",
      kota: "",
      address: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const { setFreezeUntil, getFreezeRemaining, freezeUntil } =
    useAuthFormLimitStore();
  const { setAuthData } = useOutletStore();

  // Handle Countdown
  useEffect(() => {
    const remaining = getFreezeRemaining();
    if (remaining > 0) {
      setCountdown(remaining);
      const timer = setInterval(() => {
        const newRemaining = getFreezeRemaining();
        if (newRemaining <= 0) {
          setCountdown(0);
          setFreezeUntil(null);
          clearInterval(timer);
        } else {
          setCountdown(newRemaining);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [freezeUntil, getFreezeRemaining, setFreezeUntil]);

  const onSubmit = async () => {
    if (stepper.state.isLast) {
      setIsLoading(true);
      setError(null);

      try {
        const _fullData = form.getValues();

        // Gunakan FormData untuk mendukung multipart/form-data (seperti upload file)
        const formData = new FormData();
        Object.entries(_fullData).forEach(([key, value]) => {
          const val = value as any;
          if (val !== undefined && val !== null) {
            if (val instanceof File) {
              formData.append(key, val);
            } else {
              formData.append(key, String(val));
            }
          }
        });

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          // Jangan set Content-Type secara manual saat menggunakan FormData
          // agar browser dapat mengatur boundary yang benar secara otomatis
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          const match = result.message?.match(/(\d+)\s+detik/);
          if (match && match[1]) {
            const seconds = parseInt(match[1]);
            const freezeTime = Date.now() + seconds * 1000;
            setFreezeUntil(freezeTime);
            setCountdown(seconds);
          }
          throw new Error(
            result.message || "An error occurred during registration.",
          );
        }

        // Jika registrasi berhasil, lakukan auto-login
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: _fullData.email,
          password: _fullData.password,
          callbackUrl: "/",
        });

        if (loginResult?.error) {
          toast.error("Registrasi berhasil, tetapi gagal masuk otomatis.");
          router.push("/sign-in");
          return;
        }

        // Simpan outlet_id_active ke Zustand store (sama seperti login-form.tsx)
        // Kita coba ambil dari response register dulu, jika tidak ada baru ambil dari session
        let outletId = result.data?.outlet_id_active;

        if (!outletId) {
          const sessionResponse = await fetch("/api/auth/session");
          const sessionData = await sessionResponse.json();
          outletId = sessionData?.data?.outlet_id_active;
        }

        if (outletId) {
          setAuthData({
            outlet_id_active: outletId.toString(),
          });
        }

        setFreezeUntil(null);

        toast.success("Registrasi berhasil! Selamat datang.");
        router.push("/");
        router.refresh();
      } catch (error: any) {
        const msg = error.message || "Terjadi kesalahan saat registrasi.";
        toast.error(msg);
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    } else {
      stepper.navigation.next();
    }
  };

  const currentIndex = stepper.lookup.getIndex(stepper.state.current.data.id);

  return (
    <div className={cn("relative w-full", className)} {...props}>
      {/* <DebugTools data={form.getValues()} /> */}
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 text-center lg:mb-12">
          <Badge
            variant="outline"
            className="mb-4 inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Pendaftaran Mitra Baru
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-3">
            {/* <Image
              src={logo}
              alt="MITUNI"
              width={48}
              height={48}
              className="object-cover rounded-lg"
            /> */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Bergabung dengan Mituni
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Platform manajemen laundry modern untuk mengoptimalkan bisnis Anda.
          </p>
        </div>

        {/* Main Card Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl"
        >
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-[320px_1fr]">
            {/* Sidebar - Steps */}
            <div className="border-b border-border/40 bg-background/30 p-6 lg:p-8 lg:border-b-0 lg:border-r">
              {/* Desktop Steps */}
              <div className="space-y-1 hidden lg:block">
                {stepper.state.all.map((step, index, array) => (
                  <SidebarStep
                    key={step.id}
                    step={step}
                    isActive={stepper.state.current.data.id === step.id}
                    isCompleted={index < currentIndex}
                    isLast={index === array.length - 1}
                  />
                ))}
              </div>

              {/* Mobile Steps (Horizontal) */}
              <div className="flex justify-between w-full lg:hidden">
                {stepper.state.all.map((step, index, array) => (
                  <MobileStep
                    key={step.id}
                    step={step}
                    isActive={stepper.state.current.data.id === step.id}
                    isCompleted={index < currentIndex}
                    isLast={index === array.length - 1}
                  />
                ))}
              </div>

              {/* Sidebar Footer Info (Optional) */}
              <div className="mt-12 hidden lg:block">
                <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                  <h4 className="font-medium text-sm text-primary mb-1">
                    Butuh Bantuan?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Hubungi tim support kami jika Anda mengalami kendala saat
                    mendaftar.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex flex-col p-6 lg:p-12">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={stepper.state.current.data.id}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{
                          opacity: 0,
                          x: -20,
                          transition: { duration: 0.2 },
                        }}
                        className="space-y-8"
                      >
                        {/* Step Header */}
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground">
                            {stepper.state.current.data.label}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {
                              STEPS_METADATA[stepper.state.current.data.id]
                                ?.description
                            }
                          </p>
                        </div>

                        {/* Form Content */}
                        <div className="min-h-75 py-2">
                          {stepper.flow.switch({
                            account: (step) => (
                              <AccountStep isLoading={isLoading} />
                            ),
                            brand: (step) => (
                              <BrandStep isLoading={isLoading} />
                            ),
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mt-4 mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Footer / Navigation */}
                  <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-8">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={
                        stepper.state.isFirst
                          ? () => router.push("/sign-in")
                          : () => stepper.navigation.prev()
                      }
                      disabled={isLoading}
                      className="gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {stepper.state.isFirst ? "Masuk" : "Kembali"}
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading || countdown > 0}
                      className="gap-2 rounded-full bg-primary px-8 hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                      {countdown > 0 ? (
                        `Tunggu ${countdown}s`
                      ) : stepper.state.isLast ? (
                        <>
                          Daftar Sekarang
                          <Check className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Lanjut
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Dengan mendaftar, Anda menyetujui{" "}
                <a href="#" className="underline hover:text-primary">
                  Syarat & Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="underline hover:text-primary">
                  Kebijakan Privasi
                </a>{" "}
                kami.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
