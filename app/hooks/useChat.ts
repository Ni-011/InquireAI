import { useState, useRef } from 'react';

export type SearchResult = {
  title: string;
  snippet: string;
  link: string;
};

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  searchResults?: SearchResult[];
  searchQueries?: string[];
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingId, setTypingId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const typeText = (fullText: string, messageId: number) => {
    let i = 0;
    setIsLoading(false);
    setTypingId(messageId);
    
    intervalRef.current = setInterval(() => {
      i += 2;
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, text: fullText.substring(0, i) } : msg
      ));
      
      if (i >= fullText.length) {
        clearInterval(intervalRef.current!);
        setTypingId(null);
      }
    }, 5);
  };

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setTypingId(null);
      setIsLoading(false);
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      const aiId = Date.now() + 1;
      const aiMsg: Message = { 
        id: aiId, 
        text: "", 
        isUser: false,
        searchResults: data.searchResults || undefined,
        searchQueries: data.searchQueries || undefined
      };
      
      setMessages(prev => [...prev, aiMsg]);
      typeText(data.response, aiId);
    } catch (error) {
      setIsLoading(false);
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        text: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`, 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return {
    messages,
    isLoading,
    typingId,
    sendMessage,
    stopTyping,
  };
} 