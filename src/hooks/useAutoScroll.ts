"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoScrollOptions {
  enabled?: boolean;
  threshold?: number; // Distance from bottom to trigger auto-scroll
}

export function useAutoScroll(
  dependency: any, // Usually the messages array or streaming state
  options: UseAutoScrollOptions = {}
) {
  const { enabled = true, threshold = 50 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const shouldScrollRef = useRef(true);

  // Check if user is near the bottom
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom <= threshold;
    
    setIsNearBottom(nearBottom);
    
    // If user scrolled up significantly, mark as user-initiated scroll
    if (distanceFromBottom > threshold * 2) {
      setUserHasScrolled(true);
      shouldScrollRef.current = false;
    }
  }, [threshold]);

  // Scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const shouldScroll = force || (shouldScrollRef.current && enabled);

    if (shouldScroll) {
      container.scrollTop = container.scrollHeight;
      setUserHasScrolled(false);
      shouldScrollRef.current = true;
    }
  }, [enabled]);

  // Reset scroll behavior (e.g., when new conversation starts)
  const resetScrollBehavior = useCallback(() => {
    setUserHasScrolled(false);
    shouldScrollRef.current = true;
    scrollToBottom(true);
  }, [scrollToBottom]);

  // Auto-scroll when dependency changes (new messages, etc.)
  useEffect(() => {
    if (enabled && !userHasScrolled && isNearBottom) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(scrollToBottom, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [dependency, enabled, userHasScrolled, isNearBottom, scrollToBottom]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll checks
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollPosition, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [checkScrollPosition]);

  return {
    containerRef,
    scrollToBottom,
    resetScrollBehavior,
    isNearBottom,
    userHasScrolled,
  };
} 