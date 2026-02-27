"use client";

import * as React from "react";
import {
  Bell,
  Package,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
  Tag,
  Info,
  User,
  CheckCircle2,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  NotificationInboxPopover,
  type Notification as NotificationType,
} from "@/components/ruixen/notification-inbox-popover";
import { useRouter } from "next/navigation";
import {
  getLatestNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NOTIFICATIONS_LATEST_KEY,
} from "@/app/(dashboard)/notifications/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getVerificationStatus,
  VERIFICATION_KEY,
} from "@/hooks/use-profile-verified";
import { VerificationModal } from "@/components/auth/verification-modal";

export function NotificationInfo() {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isVerificationModalOpen, setIsVerificationModalOpen] =
    React.useState(false);
  const [selectedVerificationMethod, setSelectedVerificationMethod] =
    React.useState<("email" | "whatsapp")[]>(["email", "whatsapp"]);

  const {
    data: verificationData,
    isLoading: isLoadingVerification,
    refetch: refetchVerification,
  } = useQuery({
    queryKey: VERIFICATION_KEY,
    queryFn: getVerificationStatus,
  });

  const { data: latestData, isLoading } = useQuery({
    queryKey: NOTIFICATIONS_LATEST_KEY,
    queryFn: getLatestNotifications,
    // Refetch every 5 minutes to avoid rate limiting
    refetchInterval: 300000,
    retry: false, // Don't retry if it fails (e.g. 429 Too Many Requests)
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LATEST_KEY });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menandai notifikasi");
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_LATEST_KEY });
      toast.success("Semua notifikasi ditandai sudah dibaca");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menandai semua notifikasi");
    },
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="icon" variant="outline" className="relative" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  // Map API data to component format
  const notifications: NotificationType[] = (latestData?.data || []).map(
    (item) => {
      let Icon = Bell;
      switch (item.category.toLowerCase()) {
        case "promo":
          Icon = Tag;
          break;
        case "info":
          Icon = Info;
          break;
        case "akun":
          Icon = User;
          break;
        case "transaksi":
          Icon = CheckCircle2;
          break;
        case "support":
          Icon = HelpCircle;
          break;
      }

      return {
        id: item.id,
        user: item.title, // Title as user/source
        action: "", // Body contains the action/desc
        target: item.body, // Body as target
        timestamp: item.date_ago,
        unread: !item.is_read,
        icon: Icon,
      };
    },
  );

  const isEmailVerified = !!verificationData?.data?.email_verified_at;
  const isWaVerified = !!verificationData?.data?.wa_verified_at;

  return (
    <div className="flex items-center gap-2 text-sm">
      <NotificationInboxPopover
        notifications={notifications}
        popoverWidth="w-[400px]"
        isLoading={isLoading}
        onMarkAll={() => markAllReadMutation.mutate()}
        onMarkAsRead={(id) => markReadMutation.mutate(id)}
        onViewAll={() => router.push("/notifications")}
        tabs={[
          { value: "all", label: "Semua" },
          { value: "unread", label: "Belum Dibaca" },
        ]}
      />
      {verificationData?.data &&
        verificationData?.data?.is_verified === false && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedVerificationMethod(["email"]);
                      setIsVerificationModalOpen(true);
                    }}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verifikasi Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedVerificationMethod(["whatsapp"]);
                      setIsVerificationModalOpen(true);
                    }}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verifikasi WhatsApp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

      {/* {verificationData?.data && !isWaVerified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSelectedVerificationMethod(["whatsapp"]);
                  setIsVerificationModalOpen(true);
                }}
              >
                <Phone className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Verifikasi WhatsApp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )} */}
      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        allowedMethods={selectedVerificationMethod}
        onSuccess={() => refetchVerification()}
      />
    </div>
  );
}
