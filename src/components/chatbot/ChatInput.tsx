"use client";

import React, { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";

export function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming } = useChat();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isStreaming) {
        await sendMessage(input);
        setInput("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [input, sendMessage, isStreaming]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    },
    []
  );

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "AI is responding..."
                : "Ask about personas, data, or insights..."
            }
            disabled={isStreaming}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0A523E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="flex-shrink-0 p-2 bg-[#0A523E] text-white rounded-lg hover:bg-[#0A523E]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
