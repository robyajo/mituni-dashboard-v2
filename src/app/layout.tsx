import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { inter } from "@/lib/fonts";
import NextAuthSessionProvider from "@/provider/SessionProvider";
import QueryProvider from "@/provider/QueryProvider";

export const metadata: Metadata = {
  title: "Shadcn Dashboard",
  description: "A dashboard built with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning={true}
    >
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="nextjs-ui-theme">
          <QueryProvider>
            <NextAuthSessionProvider>
              <SidebarConfigProvider>{children}</SidebarConfigProvider>
            </NextAuthSessionProvider>
            <SonnerToaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
