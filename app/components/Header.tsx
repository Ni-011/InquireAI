import { User } from "../../lib/useAuth";

interface HeaderProps {
  onHomeClick: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export default function Header({ onHomeClick, user, onLogout }: HeaderProps) {
  return (
    <div className="p-8 flex justify-between items-center">
      <button 
        onClick={onHomeClick}
        className="text-2xl font-semibold hover:text-gray-300 transition-colors"
      >
        InquireAI<sup className="text-xs text-gray-400 ml-1">Lite</sup>
      </button>
      
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Welcome, {user.name || user.email}
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
} 