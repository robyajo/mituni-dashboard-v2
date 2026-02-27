"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getBranches, BRANCHES_KEY } from "@/app/(dashboard)/branches/api";
import { Branch } from "@/app/(dashboard)/branches/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActiveOutlet } from "@/store/useOutletStore";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BranchesSwitcher() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  // Get active outlet and setter from the store
  const { outlet_id_active, setActiveOutlet } = useActiveOutlet();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: branchesResponse } = useQuery({
    queryKey: BRANCHES_KEY,
    queryFn: () => getBranches(),
    enabled: !!session?.accessToken,
  });

  const outlets = (branchesResponse?.data || []) as Branch[];

  // Only set the first outlet as active if there's no active outlet in the store
  // and we have outlets available
  React.useEffect(() => {
    if (outlets.length > 0 && outlet_id_active === null) {
      setActiveOutlet(outlets[0].id.toString());
    }
  }, [outlets, outlet_id_active, setActiveOutlet]);

  // Find the currently active outlet
  const activeOutlet = React.useMemo(() => {
    return (
      outlets.find((outlet) => outlet.id.toString() === outlet_id_active) ||
      outlets[0]
    );
  }, [outlets, outlet_id_active]);

  // Handle outlet change
  const handleOutletChange = (outlet: Branch) => {
    setActiveOutlet(outlet.id.toString());
    router.replace("/");
  };

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Store className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Alert className="p-0 rounded-xl border bg-sidebar-primary/5 shadow-sm">
              <AlertDescription className="p-0">
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-primary data-[state=open]:text-sidebar-accent-foreground "
                >
                  <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {activeOutlet?.logo_url ? (
                      <Image
                        src={activeOutlet.logo_url}
                        alt="L"
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Store className="size-6" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeOutlet?.name_brand || "Loading..."}
                    </span>
                    <span className="truncate text-xs">
                      {activeOutlet?.address}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </AlertDescription>
            </Alert>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Outlet
            </DropdownMenuLabel>
            {outlets.map((outlet, index) => (
              <DropdownMenuItem
                key={outlet.id}
                onClick={() => handleOutletChange(outlet)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                  {outlet.logo_url ? (
                    <Image
                      src={outlet.logo_url}
                      alt="L"
                      width={24}
                      height={24}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Store className="size-4" />
                  )}
                </div>
                {outlet.name_brand}
                {outlet.id.toString() === outlet_id_active && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
            {session?.data?.user?.role === "owner" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => router.push("/branches/create")}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    Tambah Outlet
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
