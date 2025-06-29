import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onDeepSearch?: () => void;
  onStop: () => void;
  isTyping: boolean;
  disabled?: boolean;
}

export default function ChatInput({ 
  input, 
  onInputChange, 
  onSend, 
  onDeepSearch, 
  onStop, 
  isTyping, 
  disabled 
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Mobile layout - stacked */}
        <div className="block sm:hidden space-y-3">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask InquireAI"
              disabled={disabled}
              className="w-full h-16 bg-gray-900/50 border-gray-800 rounded-2xl pl-14 pr-14 text-base placeholder:text-base text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:border-gray-800 focus:shadow-none focus:bg-gray-900/70 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <label htmlFor="file-upload-mobile" className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
              <input id="file-upload-mobile" type="file" accept="image/*" className="hidden" />
              <div className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-8 h-8 flex items-center justify-center transition-colors">
                <Plus className="h-4 w-4" />
              </div>
            </label>

            {isTyping ? (
              <Button
                onClick={onStop}
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-10 h-10"
              >
                <div className="w-3 h-3 border-2 border-gray-500 rounded-sm"></div>
              </Button>
            ) : (
              <Button
                onClick={onSend}
                disabled={!input.trim() || disabled}
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-10 h-10 disabled:opacity-30"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>

          <Button
            onClick={onDeepSearch}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="w-full text-sm text-gray-500 hover:text-gray-300 bg-gray-900/30 hover:bg-gray-800/50 rounded-xl px-4 h-10 disabled:opacity-30"
          >
            <Search className="h-4 w-4 mr-2" />
            Deep Research
          </Button>
        </div>

        {/* Desktop layout - inline */}
        <div className="hidden sm:block relative">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask InquireAI"
            disabled={disabled}
            className="w-full h-16 sm:h-20 bg-gray-900/50 border-gray-800 rounded-2xl pl-12 sm:pl-16 pr-48 sm:pr-72 text-base sm:!text-lg placeholder:text-base sm:placeholder:text-lg text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:border-gray-800 focus:shadow-none focus:bg-gray-900/70 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <label htmlFor="file-upload-desktop" className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 cursor-pointer">
            <input id="file-upload-desktop" type="file" accept="image/*" className="hidden" />
            <div className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-colors">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </label>

          <Button
            onClick={onDeepSearch}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="absolute right-16 sm:right-20 top-1/2 transform -translate-y-1/2 text-sm sm:text-base text-gray-500 hover:text-gray-300 bg-gray-900/30 hover:bg-gray-800/50 rounded-xl px-3 sm:px-4 h-9 sm:h-11 disabled:opacity-30"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Deep Research</span>
            <span className="sm:hidden">Deep</span>
          </Button>

          {isTyping ? (
            <Button
              onClick={onStop}
              size="icon"
              variant="ghost"
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-9 h-9 sm:w-11 sm:h-11"
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-500 rounded-sm"></div>
            </Button>
          ) : (
            <Button
              onClick={onSend}
              disabled={!input.trim() || disabled}
              size="icon"
              variant="ghost"
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-9 h-9 sm:w-11 sm:h-11 disabled:opacity-30"
            >
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 