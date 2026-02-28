"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/components/lib/auth";

export default function ProtectedLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = getUserRole();

    if (!role) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.push("/dashboard");
      return;
    }

    setAuthorized(true);
  }, []);

  if (!authorized) return null;

  return <>{children}</>;
}