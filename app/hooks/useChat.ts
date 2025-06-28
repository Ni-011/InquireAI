import { useState, useCallback } from 'react';

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
  isTyping?: boolean;
};

export type ChatResponse = {
  response: string;
  searchResults?: SearchResult[];
  searchQueries?: string[];
  searchesRemaining?: number;
  isDeepSearch?: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchesRemaining, setSearchesRemaining] = useState<number | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);

  const typeMessage = useCallback((fullText: string, messageId: number, searchResults?: SearchResult[], searchQueries?: string[]) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, searchResults, searchQueries }
        : msg
    ));
    
    const words = fullText.split(' ');
    let currentIndex = 0;
    
    const typeNextChunk = () => {
      if (currentIndex >= words.length) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isTyping: false }
            : msg
        ));
        setTypingMessageId(null);
        return;
      }

      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 2, words.length - currentIndex);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: words.slice(0, currentIndex + chunkSize).join(' ') }
          : msg
      ));

      currentIndex += chunkSize;
      setTimeout(typeNextChunk, Math.random() * 20 + 20);
    };

    typeNextChunk();
  }, []);

  const sendMessage = async (input: string, isGuest: boolean = false, isDeepSearch: boolean = false) => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && !isGuest ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          message: input,
          isGuest: isGuest,
          isDeepSearch: isDeepSearch
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      if (typeof data.searchesRemaining === 'number') {
        setSearchesRemaining(data.searchesRemaining);
      }
      
      const aiMsgId = Date.now() + 1;
      const aiMsg: Message = { 
        id: aiMsgId, 
        text: '', 
        isUser: false,
        isTyping: true
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
      setTypingMessageId(aiMsgId);
      
      typeMessage(data.response, aiMsgId, data.searchResults, data.searchQueries);
      
    } catch (error) {
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`, 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    searchesRemaining,
    isTyping: typingMessageId !== null,
  };
} 