"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { authService } from "@/lib/auth-service"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await authService.login(email, password)
      if (result.success) {
        // Redirection basée sur le rôle
        const redirectPath = authService.getRedirectPath(result.user.role)
        router.push(redirectPath)
      } else {
        setError(result.error || "Erreur de connexion")
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Login Form */}
          <div className="flex-1 p-8 lg:p-12 bg-white">
            <div className="max-w-sm mx-auto">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">dotwork</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in to your Account</h1>
                <p className="text-gray-600">Welcome back! Select method to log in:</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="mb-4 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 mb-6" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Create an account
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-10 w-16 h-16 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-center max-w-md">
              {/* Illustration Area */}
              <div className="mb-8 relative">
                {/* Dashboard mockup */}
                <div className="bg-white rounded-lg p-4 shadow-xl mb-6 mx-auto w-64">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Floating app icons */}
                <div className="absolute -left-8 top-8">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute -right-8 top-16">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-8">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <h2 className="text-2xl font-bold mb-4">Connect with every application.</h2>
              <p className="text-blue-100 mb-8">Everything you need in an easily customizable dashboard.</p>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}