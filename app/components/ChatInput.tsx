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
    <div className="p-8">
      <div className="max-w-4xl mx-auto relative">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask InquireAI"
          disabled={disabled}
          className="w-full h-20 bg-gray-900/50 border-gray-800 rounded-2xl pl-16 pr-72 !text-lg placeholder:text-lg text-white placeholder-gray-500 focus:ring-0 focus:outline-none focus:border-gray-800 focus:shadow-none focus:bg-gray-900/70 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <label htmlFor="file-upload" className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer">
          <input id="file-upload" type="file" accept="image/*" className="hidden" />
          <div className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-9 h-9 flex items-center justify-center transition-colors">
            <Plus className="h-5 w-5" />
          </div>
        </label>

        <Button
          onClick={onDeepSearch}
          disabled={disabled}
          size="sm"
          variant="ghost"
          className="absolute right-20 top-1/2 transform -translate-y-1/2 text-base text-gray-500 hover:text-gray-300 bg-gray-900/30 hover:bg-gray-800/50 rounded-xl px-4 h-11 disabled:opacity-30"
        >
          <Search className="h-5 w-5 mr-2" />
          Deep Research
        </Button>

        {isTyping ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-11 h-11"
          >
            <div className="w-4 h-4 border-2 border-gray-500 rounded-sm"></div>
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!input.trim() || disabled}
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl w-11 h-11 disabled:opacity-30"
          >
            <Send className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
} 