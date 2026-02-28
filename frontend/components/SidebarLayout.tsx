"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/components/services/api";
import { getUserRole } from "@/components/lib/auth";

export default function SidebarLayout({
  children,
  activeChatId,
}: {
  children: React.ReactNode;
  activeChatId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const role = getUserRole();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await apiFetch("/chat/user");
      setChats(res);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      
      <div className="w-72 bg-black p-6 flex flex-col justify-between border-r border-neutral-800">

        <div>
          <h1 className="text-xl font-bold mb-6">
            Legal AI Platform
          </h1>

          <nav className="space-y-3 mb-6">
            <button
              className="block text-left w-full hover:text-gray-300"
              onClick={() => router.push("/chat")}
            >
              New Chat
            </button>

            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
              <button
                className="block text-left w-full hover:text-gray-300"
                onClick={() => router.push("/admin")}
              >
                Admin Dashboard
              </button>
            )}

            {role === "SUPER_ADMIN" && (
              <button
                className="block text-left w-full hover:text-gray-300"
                onClick={() => router.push("/super-admin")}
              >
                Super Admin
              </button>
            )}
          </nav>

          <div>
            <h2 className="text-sm text-neutral-400 mb-3">
              Chat History
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() =>
                    router.push(`/chat?chatId=${chat.id}`)
                  }
                  className={`w-full text-left text-sm px-3 py-2 rounded-md transition
                    ${
                      activeChatId === chat.id
                        ? "bg-neutral-800"
                        : "hover:bg-neutral-900"
                    }`}
                >
                  {chat.title || "Untitled Chat"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}