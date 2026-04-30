"use client";

import Text from "@/app/components/ui/atoms/text";
import { ChatMessage } from "@roo/common";
import { format } from "date-fns";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardSectionHeader from "./dashboard-section-header";

type Message = {
  id: string;
  inquiryId: string;
  senderType: "user" | "company";
  content: string;
  sentAt: Date;
};

export default function ChatWindow({
  initialMessages,
  senderRole,
  inquiryId,
}: {
  initialMessages: ChatMessage[];
  senderRole: "user" | "company";
  inquiryId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((msg) => ({
      id: msg.id,
      inquiryId,
      senderType: msg.senderType,
      content: msg.content,
      sentAt: new Date(msg.sentAt),
    })),
  );
  const [draft, setDraft] = useState("");
  const [countdown, setCountdown] = useState(10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // TODO: fetch new messages
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        inquiryId,
        id: `m${Date.now()}`,
        senderType: senderRole,
        content: trimmed,
        sentAt: new Date(),
      },
    ]);
    setDraft("");
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="lg:col-span-3 h-200 bg-white rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
      <DashboardSectionHeader
        icon={"MessageCircle"}
        heading="Konverzace"
        iconBgColor="bg-zinc-100"
        iconColor="text-zinc-500"
      />

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-3"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} senderRole={senderRole} />
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-zinc-100 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Napište zprávu…"
            rows={2}
            className="flex-1 resize-none text-sm text-zinc-800 placeholder-zinc-400 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="w-10 h-10 flex items-center justify-center bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-1.5 px-1">
          <Text variant="caption" color="secondary">
            Enter pro odeslání · Shift+Enter pro nový řádek
          </Text>
          <Text variant="caption" color="secondary">
            Načtení nových zpráv za {countdown}s
          </Text>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  senderRole,
}: {
  message: Message;
  senderRole: "user" | "company";
}) {
  const isMine = message.senderType === senderRole;
  return (
    <div
      className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMine
            ? "bg-rose-500 text-white rounded-br-md"
            : "bg-zinc-100 text-zinc-900 rounded-bl-md"
        }`}
      >
        {message.content}
      </div>
      <Text variant="caption" color="secondary" className="px-1">
        {format(message.sentAt, "d. M. yyyy, H:mm")}
      </Text>
    </div>
  );
}
