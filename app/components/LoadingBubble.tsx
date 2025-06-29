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
      <div className="bg-purple-900/20 border border-purple-800/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-[95%] sm:max-w-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
          <span className="text-xs sm:text-sm text-gray-400">{messages[messageIndex]}</span>
        </div>
      </div>
    </div>
  );
} 