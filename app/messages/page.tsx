'use client'

import { useState, useRef, useEffect } from "react";
import PagebarContent from "@/components/pagebar/PagebarContent";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

const contact = {
  name: "Jane Smith",
  avatar: "https://picsum.photos/seed/jane/100/100",
  online: true,
};

const mockMessages: Message[] = [
  { id: "1", text: "Hey! Are you going to the Tech Conference next week?", sender: "them", timestamp: "10:01" },
  { id: "2", text: "Yes! I just signed up actually. Are you presenting?", sender: "me", timestamp: "10:03" },
  { id: "3", text: "I am! Doing a talk on AI in web development. Should be fun.", sender: "them", timestamp: "10:04" },
  { id: "4", text: "That sounds awesome, I'll make sure to catch your talk.", sender: "me", timestamp: "10:05" },
  { id: "5", text: "Thanks! Let me know if you want to grab coffee before it starts.", sender: "them", timestamp: "10:06" },
  { id: "6", text: "Definitely, let's do that!", sender: "me", timestamp: "10:07" },
  { id: "7", text: "okay", sender: "them", timestamp: "10:10" },
  { id: "8", text: "thx", sender: "them", timestamp: "10:11" },
  { id: "9", text: "bye", sender: "them", timestamp: "10:12" },
];

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPicker, setShowPicker] = useState(false);

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
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <PagebarContent>
        <ul className="space-y-2 text-sm">
          <li className="font-semibold text-zinc-700">Contacts</li>
        </ul>
      </PagebarContent>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-zinc-200 shadow-sm">
        <div className="relative">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {contact.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <p className="font-semibold text-zinc-800">{contact.name}</p>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-zinc-100"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          const sameAsPrev = prevMsg?.sender === msg.sender;
          const sameAsNext = nextMsg?.sender === msg.sender;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.sender === "them" && (
                <div className="w-7 flex-shrink-0">
                  {!sameAsNext && (
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-7 h-7 rounded-full object-cover mb-1"
                    />
                  )}
                </div>
              )}
              <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-sm px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === "me"
                      ? "bg-sky-500 text-white rounded-br-sm"
                      : "bg-white text-zinc-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {!sameAsNext && (
                  <span className="text-xs text-zinc-400 mt-1">{msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-zinc-200 flex items-end gap-3">
        <div className="relative flex-1">
          <div
            className="flex items-end flex-1 rounded-2xl border border-zinc-300 bg-zinc-50 focus-within:ring-2 focus-within:ring-sky-400 pr-2"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-2 text-sm text-zinc-800 focus:outline-none max-h-40 overflow-y-auto"
            />
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="text-lg pb-2 px-1 leading-none"
            >
              😊
            </button>
          </div>
        </div>
        <button
          onClick={handleSend}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-2xl text-sm transition-colors"
        >
          Send
        </button>
      </div>

      {showPicker && (
        <div className="absolute bottom-20 left-200">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}
