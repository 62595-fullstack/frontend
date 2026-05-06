'use client'

import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  sendLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  sendLabel = "Send",
  disabled,
  autoFocus,
  onBlur,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!onBlur) return;
    const next = e.relatedTarget as Node | null;
    if (next && wrapperRef.current?.contains(next)) return;
    onBlur();
  };

  useEffect(() => {
    if (value === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value]);

  const handleSend = () => {
    if (disabled) return;
    if (!value.trim()) return;
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const onEmojiClick = (data: EmojiClickData) => {
    onChange(value + data.emoji);
    setShowPicker(false);
  };

  return (
    <div ref={wrapperRef} className="flex w-full items-end gap-3">
      <div className="relative flex-1">
        <div className="flex items-end flex-1 rounded-2xl border border-brand bg-bg-input-field focus-within:ring-2 focus-within:ring-bg-brand pr-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            autoFocus={autoFocus}
            className="flex-1 resize-none bg-transparent px-4 py-2 text-sm text-text focus:outline-none max-h-40"
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPicker((p) => !p)}
              className="text-lg pb-2.5 leading-none"
            >
              😊
            </button>
            {showPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="btn-brand font-semibold px-5 py-2 rounded-2xl text-sm disabled:opacity-50"
      >
        {sendLabel}
      </button>
    </div>
  );
}
