interface HeaderProps {
  onHomeClick: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  return (
    <div className="p-8">
      <button 
        onClick={onHomeClick}
        className="text-2xl font-semibold hover:text-gray-300 transition-colors"
      >
        InquireAI<sup className="text-xs text-gray-400 ml-1">Lite</sup>
      </button>
    </div>
  );
} 