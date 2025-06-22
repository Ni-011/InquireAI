"use client";

import { useState } from "react";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageBubble from "./components/MessageBubble";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";
import AuthPage from "./components/Auth";
import { useChat } from "./hooks/useChat";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { useAuth } from "../lib/useAuth";

export default function Home() {
  const [input, setInput] = useState("");
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  const { messages, isLoading, typingId, sendMessage, stopTyping } = useChat();
  const { chatRef, endRef } = useAutoScroll(messages);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  const handleAuthSuccess = (userData: any, token: string) => {
    login(userData, token);
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex flex-col">
        <Header 
          onHomeClick={() => window.location.reload()} 
          user={user}
          onLogout={logout}
        />
        
        <div className="flex-1 flex flex-col px-8 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div ref={chatRef} className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    text={msg.text}
                    isUser={msg.isUser}
                    isTyping={typingId === msg.id}
                    searchResults={msg.searchResults}
                    searchQueries={msg.searchQueries}
                  />
                ))}
                {isLoading && <LoadingBubble />}
                <div ref={endRef} />
              </div>
            </div>
          )}
        </div>

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onStop={stopTyping}
          isTyping={!!typingId}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
