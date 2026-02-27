"use client";

import {
  AlertCircle,
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Mail,
  Phone,
  RefreshCw,
  CircleUser,
  BellDot,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useOutletStore } from "@/store/useOutletStore";
import { useState, useEffect } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getProfile,
  getVerificationStatus,
  PROFILE_KEY,
  VERIFICATION_KEY,
} from "@/hooks/use-profile-verified";
import { VerificationModal } from "@/components/auth/verification-modal";
import {
  getMembershipSubscriptions,
  MEMBERSHIP_SUBSCRIPTIONS_KEY,
} from "@/hooks/use-membership-subscriptions";
import { useDashboardFilterStore } from "@/store/useDashboardFilterStore";
import { ShineBorder } from "./ui/shine-border";
import Link from "next/link";

export function NavAvatar() {
  const { isMobile } = useSidebar();
  const { data: session, status } = useSession();
  const { clearAuth } = useOutletStore();
  const {
    data: membershipSubscriptionsData,
    isLoading: isLoadingMembershipSubscriptions,
    refetch: refetchMembershipSubscriptions,
  } = useQuery({
    queryKey: MEMBERSHIP_SUBSCRIPTIONS_KEY,
    queryFn: getMembershipSubscriptions,
  });
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });
  const {
    data: verificationData,
    isLoading: isLoadingVerification,
    refetch: refetchVerification,
  } = useQuery({
    queryKey: VERIFICATION_KEY,
    queryFn: getVerificationStatus,
  });

  const [mounted, setMounted] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { resetFilter } = useDashboardFilterStore();
  const [openSessionExpiredDialog, setOpenSessionExpiredDialog] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor verification status
  useEffect(() => {
    if (
      verificationData?.data &&
      !verificationData.data.is_verified &&
      verificationData.data.is_verified_label === "Belum Verifikasi"
    ) {
      // Only open if not already verified
      setIsVerificationModalOpen(true);
    }
  }, [verificationData]);

  // Monitor session status and profile errors
  useEffect(() => {
    if (!mounted) return;
    // 1. Check if status is unauthenticated while we are still on the page
    if (status === "unauthenticated") {
      setOpenSessionExpiredDialog(true);
    }
    // 2. Check if there's a profile error (e.g. 401 from API)
    if (error) {
      // Only show dialog if it's an auth error
      if ((error as any)?.response?.status === 401) {
        setOpenSessionExpiredDialog(true);
      }
    }
  }, [status, error, mounted]);

  const handleLogout = async () => {
    try {
      // Call logout API first
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    if (typeof window !== "undefined") {
      const cookieConsent = localStorage.getItem("cookie-consent");
      localStorage.removeItem("outlet-storage");
      localStorage.clear();
      if (cookieConsent) {
        localStorage.setItem("cookie-consent", cookieConsent);
      }
    }

    await signOut({ redirect: false });
    // Clear all query cache on logout
    resetFilter();
    queryClient.clear();
    router.replace("/login");
  };

  if (!mounted) return null;
  const verification = verificationData?.data;
  const planId = membershipSubscriptionsData?.data?.plan_id;
  const avatarRingClass =
    planId === 3
      ? "ring-yellow-500"
      : planId === 2
        ? "ring-green-500"
        : "ring-slate-300";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative inline-flex h-10 w-10 items-center justify-center cursor-pointer">
              {planId === 3 && (
                <ShineBorder
                  className="absolute inset-0 h-full w-full rounded-full"
                  borderWidth={2}
                  shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                />
              )}

              <Avatar
                className={cn(
                  "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-background relative z-10",
                  avatarRingClass,
                )}
              >
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <>
                    {profileData?.data?.photo_url && (
                      <AvatarImage
                        src={profileData?.data?.photo_url}
                        alt={profileData?.data?.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <AvatarFallback className="rounded-full">
                      {profileData?.data?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              {verification?.is_verified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground border border-background z-20">
                  <BadgeCheck className="h-3 w-3" />
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {profileData?.data?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profileData?.data?.name}
                  </span>
                  <span className="truncate text-xs">
                    {profileData?.data?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            {membershipSubscriptionsData?.data?.plan_id === 1 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/plans")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade plan
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/account")}>
                {verification?.is_verified ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Terverifikasi pada {verification.is_verified_label}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Email belum diverifikasi</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/account">
                  <CircleUser />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/billing">
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/notifications">
                  <BellDot />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <ConfirmDialog
        open={openLogoutDialog}
        onOpenChange={setOpenLogoutDialog}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari aplikasi?"
        onConfirm={handleLogout}
        confirmLabel="Logout"
        cancelLabel="Batal"
        variant="destructive"
      />

      <AlertDialog open={openSessionExpiredDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sesi Berakhir</AlertDialogTitle>
            <AlertDialogDescription>
              Sesi login Anda telah berakhir. Silakan login kembali untuk
              melanjutkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/login")}>
              Login Ulang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verification Modal */}
      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        onSuccess={refetchVerification}
      />

      {/* <DebugTools data={{ verificationData }} filePath={__filename} /> */}
    </SidebarMenu>
  );
}
