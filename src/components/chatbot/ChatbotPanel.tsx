"use client";

import React from "react";
import { X, Download, Plus } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useChat } from "@/hooks/useChat";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export function ChatbotPanel() {
  const { isOpen, closePanel } = useChatbot();
  const { clearMessages, messages } = useChat();

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (
        window.confirm(
          "Start a new conversation? This will clear the current chat."
        )
      ) {
        clearMessages();
      }
    }
  };

  const handleDownloadChat = () => {
    if (messages.length === 0) return;

    // Ask user for format preference
    const format = window.confirm(
      "Download as Markdown file? (Cancel for plain text)"
    )
      ? "md"
      : "txt";

    let chatContent: string;
    let filename: string;

    if (format === "md") {
      chatContent = `# KF Personas Chat Session\n\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;
      chatContent += messages
        .map((msg) => {
          const timestamp = msg.timestamp.toLocaleString();
          const role =
            msg.role === "user" ? "**You**" : "**KF Personas Assistant**";
          return `## ${role}\n*${timestamp}*\n\n${msg.content}\n\n---\n`;
        })
        .join("\n");
      filename = `kf-personas-chat-${
        new Date().toISOString().split("T")[0]
      }.md`;
    } else {
      chatContent = `KF Personas Chat Session\nDate: ${new Date().toLocaleString()}\n\n`;
      chatContent += messages
        .map((msg) => {
          const timestamp = msg.timestamp.toLocaleString();
          const role = msg.role === "user" ? "You" : "KF Personas Assistant";
          return `[${timestamp}] ${role}:\n${msg.content}\n\n`;
        })
        .join("---\n\n");
      filename = `kf-personas-chat-${
        new Date().toISOString().split("T")[0]
      }.txt`;
    }

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={closePanel}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#0A523E] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                KF Personas Assistant
              </h3>
              <p className="text-xs text-white/80">
                Ask about personas & insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              title="Start new conversation"
            >
              <Plus size={16} />
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleDownloadChat}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                title="Download chat history"
              >
                <Download size={16} />
              </button>
            )}

            <button
              onClick={closePanel}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              title="Close chat panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages />

        {/* Input */}
        <ChatInput />
      </div>
    </>
  );
}
