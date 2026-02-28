"use client";

import React, { useEffect, useRef, useState } from "react";
import Text from "@/app/components/ui/atoms/text";
import { MessageCircle, Send } from "lucide-react";
import SectionHeader from "./section-header";
import { InquiryChatMessage } from "@roo/common";
import { format } from "date-fns";

export default function ChatWindow({
  supplierName,
  initialMessages,
}: {
  supplierName: string;
  initialMessages: InquiryChatMessage[];
}) {
  const [messages, setMessages] =
    useState<InquiryChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        sender: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ]);
    setDraft("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="lg:col-span-3 h-200 bg-white rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
      <SectionHeader icon={MessageCircle} title="Konverzace" />

      {/* Messages */}
      <div
        ref={messagesEndRef}
        className="flex-1 h-full overflow-y-scroll px-5 py-4 flex flex-col gap-3"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
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
        <Text variant="label4" color="secondary" className="mt-1.5 px-1">
          Enter pro odeslání · Shift+Enter pro nový řádek
        </Text>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: InquiryChatMessage }) {
  const isUser = message.sender === "user";
  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-rose-500 text-white rounded-br-md"
            : "bg-zinc-100 text-zinc-800 rounded-bl-md"
        }`}
      >
        {message.content}
      </div>
      <Text variant="label4" color="secondary" className="px-1">
        {format(message.timestamp, "d. M. yyyy, H:mm")}
      </Text>
    </div>
  );
}
