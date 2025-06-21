import { SearchResult } from '../hooks/useChat';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  searchResults?: SearchResult[];
  searchQueries?: string[];
}

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function MessageBubble({ text, isUser, isTyping, searchResults, searchQueries }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? '' : 'space-y-3'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
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
        
        {/* Search Queries Used */}
        {searchQueries && searchQueries.length > 0 && !isUser && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium px-2">
              🔍 Search Queries Used
            </div>
            <div className="flex flex-wrap gap-2">
              {searchQueries.map((query, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800/50 border border-gray-600/30 rounded-md text-xs text-gray-300"
                >
                  "{query}"
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Results */}
        {searchResults && searchResults.length > 0 && !isUser && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium px-2">
              📚 Sources Used
            </div>
            {searchResults.map((result, index) => (
              <a
                key={index}
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-900/40 border border-gray-700/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="text-sm font-medium text-blue-300 mb-1 line-clamp-2">
                  [{index + 1}] {result.title}
                </div>
                <div className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {result.snippet}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {new URL(result.link).hostname}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 