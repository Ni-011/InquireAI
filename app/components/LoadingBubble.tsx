import { useState, useEffect } from 'react';

export default function LoadingBubble() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "🔍 Analyzing your question...",
    "🌐 Searching the web...",
    "📝 Generating response..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-purple-900/20 border border-purple-800/20 rounded-2xl px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">{messages[messageIndex]}</span>
        </div>
      </div>
    </div>
  );
} 