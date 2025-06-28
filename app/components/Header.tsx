interface User {
  id: string;
  email: string;
  name?: string;
}

interface HeaderProps {
  onHomeClick: () => void;
  user?: User | null;
  onLogout?: () => void;
  searchesRemaining?: number;
  onLogin?: () => void;
}

export default function Header({ onHomeClick, user, onLogout, searchesRemaining, onLogin }: HeaderProps) {
  return (
    <div className="p-8 flex justify-between items-center">
      <button 
        onClick={onHomeClick}
        className="text-2xl font-semibold hover:text-gray-300 transition-colors"
      >
        InquireAI<sup className="text-xs text-gray-400 ml-1">Lite</sup>
      </button>
      
      <div className="flex items-center gap-4">
        {typeof searchesRemaining === 'number' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Searches: {searchesRemaining}/{user ? '7' : '5'}
            </span>
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300"
                style={{ width: `${(searchesRemaining / (user ? 7 : 5)) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {user ? (
          <>
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
          </>
        ) : (
          onLogin && (
            <button
              onClick={onLogin}
              className="text-sm text-blue-400 hover:text-purple-400 transition-colors px-3 py-1 rounded-md hover:bg-gray-800"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </div>
  );
} 