'use client'

import { useState, useEffect, useRef } from "react";
import React from "react";
import Image from "next/image";
import PagebarContent from "@/components/pagebar/PagebarContent";
import MessageInput from "@/components/MessageInput";
import { Message, mockConversations, parseTimeToMinutes } from "@/lib/useMessages";

export default function Page() {
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const activeContact = mockConversations.find((c) => c.id === activeId)!;
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(
    Object.fromEntries(mockConversations.map((c) => [c.id, c.messages]))
  );
  const messages = allMessages[activeId];
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId], newMsg],
    }));
    setInput("");
  };

  return (
    <div className="page">
      <div className="flex flex-col h-full w-full font-sans">
        <PagebarContent title="Conversations">
          <ul className="space-y-1">
            {mockConversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setInput("");
                  }}
                  className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-left text-sm transition-all cursor-pointer ${
                    c.id === activeId ? "bg-brand text-bg-dark" : "hover:bg-highlight text-text"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Image src={c.avatar} alt={c.name} width={28} height={28} className="rounded-full object-cover"/>
                    {c.online && (
                      <span
                        className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full"/>
                    )}
                  </div>
                  <span className="truncate">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </PagebarContent>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-bg-light border-b border-brand shadow-sm">
          <div className="relative">
            <Image
              src={activeContact.avatar}
              alt={activeContact.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {activeContact.online && (
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"/>
            )}
          </div>
          <div>
            <p className="font-semibold text-text">{activeContact.name}</p>
            <p
              className={`text-xs ${activeContact.online ? "text-green-500" : "text-text-muted"}`}
            >
              {activeContact.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages */}
          <div
            className="flex flex-col flex-1 w-full overflow-y-auto px-6 py-4 space-y-3 bg-bg-dark"
          >
            <div className="flex-1" />
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              const sameAsNext = nextMsg?.sender === msg.sender;
              const showTimeSeparator = prevMsg &&
                parseTimeToMinutes(msg.timestamp) - parseTimeToMinutes(prevMsg.timestamp) > 60;
              const showTimeSeparatorNext = msg && nextMsg &&
                parseTimeToMinutes(nextMsg.timestamp) - parseTimeToMinutes(msg.timestamp) > 60;
              const showImageAndTimestamp = !sameAsNext || showTimeSeparatorNext;

              return (
                <React.Fragment key={msg.id}>
                  {showTimeSeparator && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-text-muted/25" />
                      <span className="text-xs text-text-muted px-1">{msg.timestamp}</span>
                      <div className="flex-1 h-px bg-text-muted/25" />
                    </div>
                  )}
                <div
                  className={`flex items-end gap-2 ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.sender === "them" && (
                    <div className="w-7 flex-shrink-0">
                      {showImageAndTimestamp && (
                        <Image
                          src={activeContact.avatar}
                          alt={activeContact.name}
                          width={28}
                          height={28}
                          className="rounded-full object-cover mb-1"
                        />
                      )}
                    </div>
                  )}
                  <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-sm px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.sender === "me"
                          ? "bg-brand text-bg-dark rounded-br-sm"
                          : showImageAndTimestamp
                            ? "bg-bg-light text-text rounded-bl-sm shadow-sm"
                            : "bg-bg-light text-text rounded-2xl shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {showImageAndTimestamp && (
                      <span className="text-xs text-text-muted mt-1">{msg.timestamp}
                  </span>
                    )}
                  </div>
                </div>
                </React.Fragment>
              );
            })}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-bg-light border-t border-brand">
            <MessageInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              placeholder="Type a message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
