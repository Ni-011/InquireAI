import { useRef, useEffect } from 'react';

export function useAutoScroll(messages: any[]) {
  const endRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const isAtBottom = () => {
    if (!chatRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10;
  };

  const scrollToBottom = () => {
    if (isAtBottom()) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { chatRef, endRef, scrollToBottom };
} 