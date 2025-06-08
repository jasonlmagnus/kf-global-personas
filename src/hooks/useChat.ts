"use client";

import { useCallback, useRef } from 'react';
import { useChatbot, Message } from '@/contexts/ChatbotContext';

export function useChat() {
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    isStreaming,
    setIsStreaming,
    streamingMessageId,
    setStreamingMessageId,
  } = useChatbot();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming || !content.trim()) return;

    // Add user message
    addMessage({
      content: content.trim(),
      role: 'user',
    });

    // Add empty assistant message for streaming
    const assistantMessageId = addMessage({
      content: '',
      role: 'assistant',
      isStreaming: true,
    });

    setIsStreaming(true);
    setStreamingMessageId(assistantMessageId);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    let assistantContent = '';

    try {
      // Prepare messages for API (exclude the empty assistant message we just added)
      const apiMessages = messages
        .filter(msg => !(msg.role === 'assistant' && msg.content === ''))
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add the current user message
      apiMessages.push({
        role: 'user',
        content: content.trim(),
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataContent = line.slice(6).trim();
                
                // Check for the [DONE] marker which signals end of stream
                if (dataContent === '[DONE]') {
                  break;
                }
                
                try {
                  const data = JSON.parse(dataContent);
                  
                  if (data.done) {
                    // Streaming complete
                    break;
                  }
                  
                  if (data.content) {
                    assistantContent += data.content;
                    updateMessage(assistantMessageId, assistantContent);
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e, 'Line:', line);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted (user scrolled up)
        updateMessage(assistantMessageId, assistantContent + '\n\n[Response interrupted]');
      } else {
        // Other error
        updateMessage(assistantMessageId, 'Sorry, I encountered an error. Please try again.');
      }
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  }, [
    messages,
    addMessage,
    updateMessage,
    isStreaming,
    setIsStreaming,
    setStreamingMessageId,
  ]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isStreaming,
    stopStreaming,
    streamingMessageId,
  };
} 