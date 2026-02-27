import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";

export default function SignUp2Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
