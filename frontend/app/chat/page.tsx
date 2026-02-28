"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/components/services/api";
import StructuredResponse from "@/components/StructuredResponse";
import SidebarLayout from "@/components/SidebarLayout";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("chatId");

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();

  useEffect(() => {
    if (chatIdFromUrl) {
      loadChat(chatIdFromUrl);
    } else {
      setActiveChatId(undefined);
      setResponse(null);
    }
  }, [chatIdFromUrl]);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({
          query,
          chatId: activeChatId,
        }),
      });

      setResponse({
        ...res,
        messageId: res.messageId,
        isBookmarked: res.isBookmarked,
      });

      setActiveChatId(res.chatId);
      setQuery("");
    } catch (err) {
      console.error(err);
      alert("Error generating response");
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const chat = await apiFetch(`/chat/${chatId}`);

      if (!chat?.messages?.length) {
        setResponse(null);
        return;
      }

      const assistantMessages = chat.messages.filter(
        (m: any) => m.role === "ASSISTANT"
      );

      if (!assistantMessages.length) {
        setResponse(null);
        return;
      }

      const latestAssistant =
        assistantMessages[assistantMessages.length - 1];

      setResponse({
        ...latestAssistant.structuredResponse,
        messageId: latestAssistant.id,
        isBookmarked: latestAssistant.isBookmarked,
      });

      setActiveChatId(chatId);

    } catch (err) {
      console.error("Load chat error:", err);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <SidebarLayout activeChatId={activeChatId}>
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">

          <div className="border-b border-neutral-800 px-6 py-4">
            <h1 className="text-lg font-semibold">
              AI Legal Research Assistant
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10">
            <div className="max-w-3xl mx-auto space-y-8">

              {!response && (
                <div className="text-center text-neutral-500 mt-32">
                  Ask anything about law.
                </div>
              )}

              {response && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <StructuredResponse data={response} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-800 px-6 py-6">
            <div className="max-w-3xl mx-auto flex gap-3">

              <textarea
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-3 resize-none"
                rows={2}
                placeholder="Ask your legal question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-white text-black px-5 py-2 rounded-xl"
              >
                {loading ? "Thinking..." : "Send"}
              </button>

            </div>
          </div>

        </div>
      </SidebarLayout>
    </ProtectedLayout>
  );
}