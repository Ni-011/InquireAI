"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"

interface AuthPageProps {
  onAuthSuccess: (user: any, token: string) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
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
      const res = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { email, password, name: `${firstName} ${lastName}`.trim() })
      })

      const data = await res.json()
      
      if (res.ok) {
        onAuthSuccess(data.user, data.token)
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
      <Card className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              {isLogin ? "Welcome back" : "Create account"}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            {isLogin ? "Enter your credentials to access your account" : "Enter your information to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-200 text-sm font-medium">First name</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className="bg-slate-800/80 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-200 text-sm font-medium">Last name</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className="bg-slate-800/80 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email address</Label>
              <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" className="bg-slate-800/80 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 transition-all duration-200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Enter your password" className="bg-slate-800/80 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 pr-10 transition-all duration-200" />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200 text-sm font-medium">Confirm password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="bg-slate-800/80 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-purple-400/30 focus:ring-1 focus:ring-purple-400/10 pr-10 transition-all duration-200" />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign in" : "Create account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm pt-4 border-t border-slate-700/50">
            <span className="text-slate-400">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{" "}
            <Button variant="link" className="px-0 text-blue-400/80 hover:text-purple-400/80 font-medium text-sm transition-colors" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
