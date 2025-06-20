export default function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-purple-900/20 border border-purple-800/20 rounded-2xl px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">Thinking...</span>
        </div>
      </div>
    </div>
  );
} 