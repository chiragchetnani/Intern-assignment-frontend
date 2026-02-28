"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/components/lib/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();

    if (!role) {
      router.push("/login");
      return;
    }

    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "SUPER_ADMIN") {
      router.push("/super-admin");
    } else {
      router.push("/chat");
    }
  }, []);

  return <div>Redirecting...</div>;
}