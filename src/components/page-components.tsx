"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbType } from "@/types";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, Zap } from "lucide-react";
import BannerAnnouncement from "@/components/ruixen/banner-announcement";

import { useQuery } from "@tanstack/react-query";
import {
  getVerificationStatus,
  VERIFICATION_KEY,
} from "@/hooks/use-profile-verified";
import { NavUser } from "./nav-user";
import { NavAvatar } from "./avatar-nav";
import { useSession } from "next-auth/react";
import { CommandSearch, SearchTrigger } from "./command-search";
import { SiteFooter } from "./site-footer";
import { NotificationInfo } from "./notification-info";

export default function PageConponentsAdmin({
  children,
  breadcrumb,
  title,
  description,
}: {
  children: React.ReactNode;
  breadcrumb: BreadcrumbType[];
  title: string;
  description?: string;
}) {
  // const {
  //   data: verificationData,
  //   isLoading: isLoadingVerification,
  //   refetch: refetchVerification,
  // } = useQuery({
  //   queryKey: VERIFICATION_KEY,
  //   queryFn: getVerificationStatus,
  // });
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <BannerAnnouncement
        variant="gradient"
        className=" text-[12px] rounded-t-md py-2"
        icon={<Zap className="size-4" />}
        actionLabel="Upgrade"
        actionHref="#"
      >
        Your trial ends in 3 days. Upgrade to continue using all features.
      </BannerAnnouncement>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex h-15 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1 max-w-md">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, idx) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      {item.isCurrent ? (
                        <BreadcrumbPage className="hidden md:block">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={item.href}
                          className="hidden md:block"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {idx < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex-1 max-w-sm">
              <SearchTrigger onClick={() => setSearchOpen(true)} />
            </div>
            {/* <SearchTrigger onClick={() => setSearchOpen(true)} /> */}
            {session?.data?.user?.role === "owner" && (
              <>
                <NotificationInfo />
              </>
            )}
            <ModeToggle />
            <NavAvatar />
          </div>
        </div>
      </header>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
      <SiteFooter />
    </>
  );
}
