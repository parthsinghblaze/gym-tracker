"use client";

import Auth from "@/app/components/Auth";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  return <Auth onSuccess={handleSuccess} />;
}
