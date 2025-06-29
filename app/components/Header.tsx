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
    <div className="p-4 sm:p-6 lg:p-8 flex justify-between items-center">
      <button 
        onClick={onHomeClick}
        className="text-lg sm:text-xl lg:text-2xl font-semibold hover:text-gray-300 transition-colors"
      >
        <span className="block sm:hidden">InquireAI</span>
        <span className="hidden sm:block">InquireAI<sup className="text-xs text-gray-400 ml-1">Lite</sup></span>
      </button>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {typeof searchesRemaining === 'number' && (
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm text-gray-400">
              <span className="hidden sm:inline">Searches: </span>
              {searchesRemaining}/{user ? '7' : '5'}
            </span>
            <div className="w-8 sm:w-12 lg:w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300"
                style={{ width: `${(searchesRemaining / (user ? 7 : 5)) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {user ? (
          <>
            <span className="text-xs sm:text-sm text-gray-400 hidden sm:block">
              Welcome, {user.name || user.email}
            </span>
            <span className="text-xs text-gray-400 block sm:hidden">
              {user.name?.split(' ')[0] || user.email.split('@')[0]}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-gray-800"
              >
                Logout
              </button>
            )}
          </>
        ) : (
          onLogin && (
            <button
              onClick={onLogin}
              className="text-xs sm:text-sm text-blue-400 hover:text-purple-400 transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-gray-800"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </div>
  );
} 