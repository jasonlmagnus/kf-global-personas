"use client";

import React from "react";
import { Message as MessageType } from "@/contexts/ChatbotContext";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@/contexts/ThemeContext";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming;
  const { theme } = useTheme();

  const userBubbleColor = theme?.chatbot.userBubbleColor || "#0A523E";
  const assistantBubbleColor = theme?.chatbot.assistantBubbleColor || "#F1FAEE";
  const assistantTextColor = theme?.colors.text || "#1f2937";

  return (
    <div
      className={`flex gap-3 p-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: isUser ? userBubbleColor : "transparent" }}
      >
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} className="text-gray-600" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex flex-col max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            backgroundColor: isUser ? userBubbleColor : assistantBubbleColor,
            color: isUser ? theme?.colors.textLight : assistantTextColor,
            borderRadius: isUser
              ? "0.5rem 0.5rem 0.125rem 0.5rem"
              : "0.5rem 0.5rem 0.5rem 0.125rem",
          }}
        >
          <div className="text-sm">
            {isUser ? (
              // User messages: simple text with whitespace preserved
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              // AI messages: render markdown with custom styling
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    // Custom styling for markdown elements
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mb-1">{children}</h3>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-current opacity-60 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
