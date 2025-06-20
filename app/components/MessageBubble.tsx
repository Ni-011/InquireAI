interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function MessageBubble({ text, isUser, isTyping }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-blue-900/40 border border-blue-800/30 text-gray-100'
          : 'bg-purple-900/20 border border-purple-800/20 text-gray-300'
      }`}>
        <div className="text-base leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: formatText(text) }} />
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
} 