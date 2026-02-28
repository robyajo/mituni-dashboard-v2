"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageConponentsAdmin from "@/components/page-components";
import VPageAccount from "./_components/v-page";

const accountFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountSettings() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: AccountFormValues) {
    console.log("Form submitted:", data);
    // Here you would typically save the data
  }

  return (
    <PageConponentsAdmin
      breadcrumb={[
        {
          label: "Account",
          href: "/account-settings",
        },
      ]}
      title="Account Settings"
      description="Manage your account settings and preferences."
    >
      <div className="space-y-6 px-4 lg:px-6">
        <VPageAccount />
      </div>
    </PageConponentsAdmin>
  );
}
