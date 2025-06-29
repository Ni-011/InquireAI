"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageBubble from "./components/MessageBubble";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { useAutoScroll } from "./hooks/useAutoScroll";

// Simple auth interface
interface User {
  id: string;
  email: string;
  name?: string;
}

// Beautiful auth form component with all original styling and animations
function AuthForm({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { email, password, firstName, lastName, confirmPassword } = form
    
    if (!email || !password || password.length < 8) {
      setError("Email and password (8+ chars) required")
      setIsLoading(false)
      return
    }

    if (!isLogin && (!firstName || password !== confirmPassword)) {
      setError(!firstName ? "First name required" : "Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: isLogin ? undefined : `${firstName} ${lastName}`.trim(),
          action: isLogin ? 'login' : 'register'
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        onLogin(data.user, data.token)
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-2xl rounded-lg p-6 sm:p-8">
        <div className="space-y-1 text-center pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              {isLogin ? "Welcome back" : "Create account"}
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isLogin ? "Enter your credentials to access your account" : "Enter your information to create your account"}
          </p>
        </div>
        
        <div className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-slate-200 text-xs sm:text-sm font-medium">First name</label>
                  <input 
                    id="firstName" 
                    value={form.firstName} 
                    onChange={handleChange} 
                    placeholder="John" 
                    className="w-full p-2.5 sm:p-3 bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200 rounded-md outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-slate-200 text-xs sm:text-sm font-medium">Last name</label>
                  <input 
                    id="lastName" 
                    value={form.lastName} 
                    onChange={handleChange} 
                    placeholder="Doe" 
                    className="w-full p-2.5 sm:p-3 bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200 rounded-md outline-none text-sm" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-slate-200 text-xs sm:text-sm font-medium">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="john@company.com" 
                className="w-full p-2.5 sm:p-3 bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200 rounded-md outline-none text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-slate-200 text-xs sm:text-sm font-medium">Password</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Enter your password" 
                  className="w-full p-2.5 sm:p-3 bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 pr-10 transition-all duration-200 rounded-md outline-none text-sm" 
                />
                <button 
                  type="button" 
                  className="absolute right-0 top-0 h-full px-2.5 sm:px-3 py-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors rounded-r-md text-sm" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-slate-200 text-xs sm:text-sm font-medium">Confirm password</label>
                <div className="relative">
                  <input 
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm your password" 
                    className="w-full p-2.5 sm:p-3 bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 pr-10 transition-all duration-200 rounded-md outline-none text-sm" 
                  />
                  <button 
                    type="button" 
                    className="absolute right-0 top-0 h-full px-2.5 sm:px-3 py-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors rounded-r-md text-sm" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm sm:text-base">{isLogin ? "Signing in..." : "Creating account..."}</span>
                </div>
              ) : (
                isLogin ? "Sign in" : "Create account"
              )}
            </button>
          </form>

          <div className="text-center text-xs sm:text-sm pt-4 border-t border-slate-700/50">
            <span className="text-slate-400">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{" "}
            <button 
              className="text-blue-400/80 hover:text-purple-400/80 font-medium text-xs sm:text-sm transition-colors" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestSearchesUsed, setGuestSearchesUsed] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  
  const { messages, isLoading, sendMessage, searchesRemaining, isTyping } = useChat();
  const { chatRef, endRef } = useAutoScroll(messages, isTyping);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const today = new Date().toISOString().split('T')[0];
      const lastSearchDate = localStorage.getItem('lastGuestSearchDate');

      if (lastSearchDate !== today) {
        localStorage.setItem('lastGuestSearchDate', today);
        localStorage.setItem('guestSearchCount', '0');
        setGuestSearchesUsed(0);
      } else {
        setGuestSearchesUsed(parseInt(localStorage.getItem('guestSearchCount') || '0'));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleSend = () => {
    if (!user && guestSearchesUsed >= 5) {
      return;
    }
    
    sendMessage(input, !user);
    setInput("");
    
    if (!user) {
      const newCount = guestSearchesUsed + 1;
      localStorage.setItem('guestSearchCount', newCount.toString());
      setGuestSearchesUsed(newCount);
    }
  };

  const handleDeepSearch = () => {
    if (!input.trim()) {
      return;
    }

    if (!user) {
      // If a guest user clicks "Deep Research", show the login form.
      setShowAuth(true);
    } else {
      // If a logged-in user clicks, perform the deep search.
      sendMessage(input, false, true); // isGuest: false, isDeepSearch: true
      setInput("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form only if user explicitly tries to sign up
  // Allow guest usage with limited searches

  if (showAuth) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex flex-col">
        <Header 
          onHomeClick={() => window.location.reload()} 
          user={user}
          onLogout={handleLogout}
          searchesRemaining={user ? (searchesRemaining ?? undefined) : (5 - guestSearchesUsed)}
          onLogin={() => setShowAuth(true)}
        />
        
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div ref={chatRef} className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
              <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    text={msg.text}
                    isUser={msg.isUser}
                    searchResults={msg.searchResults}
                    searchQueries={msg.searchQueries}
                    isTyping={msg.isTyping}
                  />
                ))}
                {isLoading && <LoadingBubble />}
                <div ref={endRef} />
              </div>
            </div>
          )}
        </div>

        {!user && guestSearchesUsed >= 5 && (
          <div className="px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-gray-300 mb-3 text-sm sm:text-base">
                You've used all 5 guest searches for today! 🔍
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Sign Up for more Daily Searches</span>
                <span className="sm:hidden">Sign Up for More</span>
              </button>
            </div>
          </div>
        )}

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onDeepSearch={handleDeepSearch}
          onStop={() => {}}
          isTyping={false}
          disabled={isLoading || (!user && guestSearchesUsed >= 5)}
        />
      </div>
    </div>
  );
}
