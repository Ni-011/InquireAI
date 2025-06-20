"use client";

import { useState } from "react";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageBubble from "./components/MessageBubble";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { useAutoScroll } from "./hooks/useAutoScroll";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, isLoading, typingId, sendMessage, stopTyping } = useChat();
  const { chatRef, endRef } = useAutoScroll(messages);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex flex-col">
        <Header onHomeClick={() => window.location.reload()} />
        
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
