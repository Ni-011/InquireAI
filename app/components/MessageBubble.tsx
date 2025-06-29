import { SearchResult } from '../hooks/useChat';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  searchResults?: SearchResult[];
  searchQueries?: string[];
  isTyping?: boolean;
}

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

// Typing cursor component
function TypingCursor() {
  return (
    <span className="inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse">
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
      <span className="block w-full h-full bg-purple-400 animate-blink"></span>
    </span>
  );
}

export default function MessageBubble({ text, isUser, searchResults, searchQueries, isTyping }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-full max-w-[95%] sm:max-w-[85%] lg:max-w-[80%] ${isUser ? '' : 'space-y-3 sm:space-y-4'}`}>
        {/* Main Message */}
        <div className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
          isUser 
            ? 'bg-blue-900/40 border border-blue-800/30 text-gray-100'
            : 'bg-purple-900/20 border border-purple-800/20 text-gray-300'
        }`}>
          <div className="text-sm sm:text-base leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: formatText(text) }} />
            {isTyping && <TypingCursor />}
          </div>
        </div>
        
        {/* Search Queries Used - Only show after typing is complete */}
        {searchQueries && searchQueries.length > 0 && !isUser && !isTyping && (
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-300">
              <span className="text-base sm:text-lg">🔍</span>
              Search Queries Used ({searchQueries.length})
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {searchQueries.map((query, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-900/30 border border-blue-700/40 rounded-md sm:rounded-lg text-xs sm:text-sm text-blue-200 font-mono break-all"
                >
                  "{query}"
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Results Sources - Only show after typing is complete */}
        {searchResults && searchResults.length > 0 && !isUser && !isTyping && (
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-300">
              <span className="text-base sm:text-lg">📚</span>
              Sources Used ({searchResults.length})
            </div>
            <div className="grid gap-2 sm:gap-3">
              {searchResults.map((result, index) => (
                <a
                  key={index}
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 sm:p-4 bg-gray-900/60 border border-gray-700/40 rounded-lg hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-200 transform hover:scale-[1.01] sm:hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-300 mt-0.5">
                          {index + 1}
                        </span>
                        <h3 className="text-xs sm:text-sm font-medium text-blue-300 group-hover:text-blue-200 line-clamp-2 transition-colors leading-tight">
                          {result.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3 mb-2 sm:mb-3 leading-relaxed pl-7 sm:pl-8">
                        {result.snippet}
                      </p>
                      <div className="flex items-center gap-2 pl-7 sm:pl-8">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/20 border border-green-400/40 rounded-full flex items-center justify-center">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full"></span>
                          </span>
                          <span className="text-xs text-gray-500 font-medium truncate">
                            {new URL(result.link).hostname}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-700/30">
              <p className="text-xs text-gray-500 text-center">
                💡 <span className="hidden sm:inline">Click any source above to visit the original article</span>
                <span className="sm:hidden">Tap sources to visit articles</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 