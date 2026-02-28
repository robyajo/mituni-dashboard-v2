"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  Mail,
  Phone,
  Shield,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
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

interface ViewProfileProps {
  onEdit: () => void;
}

export default function ViewProfile({ onEdit }: ViewProfileProps) {
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });

  const { data: verificationData, isLoading: isLoadingVerification } = useQuery(
    {
      queryKey: VERIFICATION_KEY,
      queryFn: getVerificationStatus,
    },
  );

  const verification = verificationData?.data;
  const user = profileData?.data;
  const isLoading = isLoadingProfile || isLoadingVerification;

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-6">Data tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-0">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">
              Informasi Pribadi
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Detail informasi akun Anda saat ini.
            </p>
          </div>
          <Button onClick={onEdit} size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profil
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 min-w-50">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-muted">
                  <AvatarImage src={user.photo_url} alt={user.name} />
                  <AvatarFallback className="text-4xl">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {verification?.is_verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full border-2 border-background">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{verification.is_verified_label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="text-center">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid gap-6 flex-1 w-full bg-muted/30 p-6 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Nama Lengkap
                    </span>
                  </div>
                  <p className="font-medium text-lg">{user.name}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Email
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg break-all">
                      {user.email}
                    </p>
                    {verification?.is_verified ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email {verification.is_verified_label}</p>
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
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      No. Telepon
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg">{user.phone_number}</p>
                    {verification?.is_verified ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              WhatsApp {""}
                              {verification.is_verified_label}
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
                            <p>WhatsApp belum diverifikasi</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Role
                    </span>
                  </div>
                  <p className="font-medium text-lg capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status Card */}
      {verification && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Status Verifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 border rounded-lg bg-muted/20">
                <div
                  className={`p-2 rounded-full mr-4 ${verification.is_verified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Verifikasi Email</p>
                  <p className="text-sm text-muted-foreground">
                    {verification.is_verified
                      ? `${verification.is_verified_label}`
                      : "Belum diverifikasi"}
                  </p>
                </div>
                {verification.is_verified ? (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="ml-auto h-5 w-5 text-yellow-500" />
                )}
              </div>

              <div className="flex items-center p-4 border rounded-lg bg-muted/20">
                <div
                  className={`p-2 rounded-full mr-4 ${verification.is_verified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                >
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Verifikasi WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    {verification.is_verified
                      ? `${verification.is_verified_label}`
                      : "Belum diverifikasi"}
                  </p>
                </div>
                {verification.is_verified ? (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="ml-auto h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
