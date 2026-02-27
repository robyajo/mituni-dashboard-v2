"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, RefreshCw, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useActiveOutlet } from "@/store/useOutletStore";

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  allowedMethods?: ("email" | "whatsapp")[];
}

export function VerificationModal({
  open,
  onOpenChange,
  onSuccess,
  allowedMethods = ["email", "whatsapp"],
}: VerificationModalProps) {
  const { outlet_id_active } = useActiveOutlet();

  const [verificationMethod, setVerificationMethod] = useState<
    "email" | "whatsapp" | null
  >(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRequestVerification = async (method: "email" | "whatsapp") => {
    try {
      setIsSendingOtp(true);
      const response = await axios.post("/api/verified/resend", {
        type: method === "whatsapp" ? "wa" : method,
        branch_id: outlet_id_active,
      });

      if (response.data.success) {
        toast.success(response.data.message || "OTP berhasil dikirim");
        setVerificationMethod(method);
        setShowOtpInput(true);

        // Parse expires_in from response
        // Example: "3 minutes"
        const expiresIn = response.data.data?.expires_in;
        if (expiresIn) {
          const match = expiresIn.toString().match(/(\d+)/);
          if (match) {
            const minutes = parseInt(match[0]);
            setCountdown(minutes * 60);
          }
        } else {
          // Default to 3 minutes if not provided
          setCountdown(180);
        }
      } else {
        toast.error(response.data.message || "Gagal mengirim OTP");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat mengirim OTP",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (otp.length < 6) {
      toast.error("Masukkan kode OTP 6 digit");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await axios.post("/api/verified", {
        otp,
        branch_id: outlet_id_active,
        type: verificationMethod === "whatsapp" ? "wa" : verificationMethod,
      });

      if (response.data.success) {
        toast.success("Verifikasi berhasil");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data.message || "Kode OTP salah");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat verifikasi",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeMethod = () => {
    setShowOtpInput(false);
    setOtp("");
    setVerificationMethod(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {countdown > 0 && (
          <div className="absolute right-12 top-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5" />
            <span>Kirim ulang:</span>
            <span className="tabular-nums text-primary font-bold">
              {formatTime(countdown)}
            </span>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Verifikasi Akun Diperlukan</DialogTitle>
          <DialogDescription>
            {showOtpInput
              ? `Masukkan kode OTP yang telah dikirim ke ${
                  verificationMethod === "email" ? "Email" : "WhatsApp"
                } Anda.`
              : "Pilih metode verifikasi untuk mengamankan akun Anda."}
          </DialogDescription>
        </DialogHeader>

        {!showOtpInput ? (
          <div className="grid gap-4 py-4">
            {allowedMethods.includes("email") && (
              <Button
                variant="outline"
                className="h-14 justify-start gap-4 text-left"
                onClick={() => handleRequestVerification("email")}
                disabled={isSendingOtp || countdown > 0}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="grid gap-1">
                  <div className="font-semibold">Verifikasi Email</div>
                  <div className="text-xs text-muted-foreground">
                    Kirim kode OTP ke email terdaftar
                  </div>
                </div>
              </Button>
            )}
            {allowedMethods.includes("whatsapp") && (
              <Button
                variant="outline"
                className="h-14 justify-start gap-4 text-left"
                onClick={() => handleRequestVerification("whatsapp")}
                disabled={isSendingOtp || countdown > 0}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid gap-1">
                  <div className="font-semibold">Verifikasi WhatsApp</div>
                  <div className="text-xs text-muted-foreground">
                    Kirim kode OTP ke WhatsApp terdaftar
                  </div>
                </div>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={handleSubmitVerification}
                disabled={isVerifying || otp.length < 6}
              >
                {isVerifying ? "Memverifikasi..." : "Verifikasi"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <Button
                  variant="link"
                  className="h-auto p-0 text-muted-foreground"
                  onClick={handleChangeMethod}
                  disabled={isVerifying}
                >
                  Ganti Metode
                </Button>
                <Button
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => handleRequestVerification(verificationMethod!)}
                  disabled={isSendingOtp || isVerifying || countdown > 0}
                >
                  {isSendingOtp ? (
                    "Mengirim..."
                  ) : countdown > 0 ? (
                    <span className="text-muted-foreground">
                      Kirim ulang ({formatTime(countdown)})
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3" /> Kirim Ulang
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
