"use client";

import Text from "@/app/components/ui/atoms/text";
import { useAuth } from "@/app/context/auth/auth-context";
import {
  useChatMessagesByInquiry,
  useCreateChatMessage,
} from "@/app/react-query/chat-messages/hooks";
import { useUpdateInquiry } from "@/app/react-query/inquiries/hooks";
import { ChatMessage } from "@roo/common";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardSectionHeader from "./dashboard-section-header";

function getTextFromContent(content: ChatMessage["content"]): string {
  if (!content) return "";
  const block = content.find((b) => b.blockType === "text");
  return block?.text ?? "";
}

export default function ChatWindow({
  senderRole,
  inquiryId,
  listingId,
}: {
  senderRole: ChatMessage["senderType"];
  inquiryId: string;
  listingId: string;
}) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: messagesData } = useChatMessagesByInquiry(inquiryId, {
    refetchInterval: 5_000,
  });
  const { mutate: sendMessage, isPending } = useCreateChatMessage();
  const { mutate: patchInquiry } = useUpdateInquiry({ listingId });

  const messages = messagesData?.docs ?? [];

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || !user) return;

    sendMessage(
      {
        inquiry: inquiryId,
        sender: user.id,
        senderType: senderRole,
        sentAt: new Date().toISOString(),
        content: [{ blockType: "text", text: trimmed }],
      },
      {
        onSuccess: () => setDraft(""),
      },
    );

    if (senderRole === "user") {
      patchInquiry({
        id: inquiryId,
        data: {
          activity: { lastUserMessageSentAt: new Date().toISOString() },
        },
      });
    } else {
      patchInquiry({
        id: inquiryId,
        data: {
          activity: { lastCompanyMessageSentAt: new Date().toISOString() },
        },
      });
    }
  };

  return (
    <div className="lg:col-span-3 h-150 bg-white rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
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
                handleSend();
              }
            }}
            placeholder="Napište zprávu…"
            rows={2}
            className="flex-1 resize-none text-sm text-zinc-800 placeholder-zinc-400 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isPending}
            className="w-10 h-10 flex items-center justify-center bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 px-1">
          <Text variant="caption" color="secondary">
            Enter pro odeslání · Shift+Enter pro nový řádek
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
  message: ChatMessage;
  senderRole: "user" | "company";
}) {
  const isMine = message.senderType === senderRole;
  const text = getTextFromContent(message.content);

  return (
    <div
      className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          !isMine
            ? "bg-rose-500 text-white rounded-br-md"
            : "bg-slate-900 text-white rounded-bl-md"
        }`}
      >
        {text}
      </div>
      <Text variant="caption" color="secondary" className="px-1">
        {format(new Date(message.sentAt), "d. M. yyyy, H:mm")}
      </Text>
    </div>
  );
}
