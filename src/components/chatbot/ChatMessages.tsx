"use client";

import React, { useEffect } from "react";
import { Message } from "./Message";
import { useChat } from "@/hooks/useChat";
import { useAutoScroll } from "@/hooks/useAutoScroll";

export function ChatMessages() {
  const { messages, isStreaming, stopStreaming } = useChat();

  const { containerRef, userHasScrolled, resetScrollBehavior } = useAutoScroll(
    messages,
    { enabled: true }
  );

  // Stop streaming when user scrolls up
  useEffect(() => {
    if (userHasScrolled && isStreaming) {
      stopStreaming();
    }
  }, [userHasScrolled, isStreaming, stopStreaming]);

  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center text-gray-500 p-8"
      >
        <div className="text-center">
          <div className="text-lg font-medium mb-2">
            Welcome to KF Personas AI Chat
          </div>
          <div className="text-sm">
            Ask me anything about personas, consumer data, or market insights!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="space-y-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      {/* Scroll indicator when user has scrolled up during streaming */}
      {userHasScrolled && isStreaming && (
        <div className="sticky bottom-0 left-0 right-0 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 mx-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span>Response paused - scroll down to continue</span>
            <button
              onClick={resetScrollBehavior}
              className="text-yellow-600 hover:text-yellow-800 underline"
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
