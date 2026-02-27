import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication - ShadcnStore",
  description: "Sign in to your account or create a new one",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.accessToken) {
    redirect("/");
  }
  return <div className="min-h-screen bg-background">{children}</div>;
}
