import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Headset, Mail, Phone, MessageCircle } from "lucide-react";

export function NavSupport() {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return (
      <div className="flex items-center justify-center py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title="Layanan Support"
        >
          <Headset className="h-5 w-5" />
          <span className="sr-only">Support</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Headset className="h-4 w-4" />
          </div>
          <div className="grid gap-0.5">
            <h3 className="text-sm font-semibold text-foreground">
              Pusat Bantuan
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Butuh bantuan? Hubungi kami.
            </p>
          </div>
        </div>

        <Button
          className="mt-3 w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90 h-8 text-xs font-medium"
          size="sm"
        >
          <MessageCircle className="mr-2 h-3.5 w-3.5" />
          Chat Support
        </Button>
      </div>
    </div>
  );
}
