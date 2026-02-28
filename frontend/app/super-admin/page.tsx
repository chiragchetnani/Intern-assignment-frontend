"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/components/services/api";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/components/lib/auth";
import SidebarLayout from "@/components/SidebarLayout";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function SuperAdminPage() {
  const router = useRouter();
  const [sources, setSources] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const role = getUserRole();

    if (role !== "SUPER_ADMIN") {
      router.push("/dashboard");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    const sourcesRes = await apiFetch("/repository-sources");
    const auditRes = await apiFetch("/admin/audit-logs");

    setSources(sourcesRes);
    setAuditLogs(auditRes);
  };

  const toggleSource = async (id: string, enabled: boolean) => {
    await apiFetch(`/repository-sources/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: !enabled }),
    });

    fetchData();
  };

  return (
    <ProtectedLayout allowedRoles={["SUPER_ADMIN"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        <div>
          <h1 className="text-3xl font-semibold text-neutral-100">
            Super Admin Panel
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            System configuration & audit monitoring
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-neutral-100 mb-6">
            Research Sources
          </h2>

          <div className="space-y-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between border-b border-neutral-800 pb-3"
              >
                <span className="text-neutral-200">
                  {source.name}
                </span>

                <button
                  onClick={() =>
                    toggleSource(source.id, source.enabled)
                  }
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    source.enabled
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                  }`}
                >
                  {source.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-neutral-100 mb-6">
            Audit Logs
          </h2>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="border-b border-neutral-800 pb-3"
              >
                <p className="text-neutral-200">
                  <span className="font-medium">
                    {log.action}
                  </span>{" "}
                  — {log.user?.email || "System"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </SidebarLayout>
    </ProtectedLayout>
  );
}