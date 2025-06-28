import { useRef, useEffect, useCallback } from 'react';

export function useAutoScroll(messages: any[], isTyping: boolean = false) {
  const endRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAtBottom = useCallback(() => {
    if (!chatRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10;
  }, []);

  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (isAtBottom()) {
      endRef.current?.scrollIntoView({ 
        behavior: smooth ? "smooth" : "auto",
        block: "end"
      });
    }
  }, [isAtBottom]);

  useEffect(() => {
    if (isTyping) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      
      scrollIntervalRef.current = setInterval(() => {
        scrollToBottom(false);
      }, 50);
      
      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      };
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  }, [isTyping, scrollToBottom]);

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom(true);
    }
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  return { chatRef, endRef, scrollToBottom };
} 