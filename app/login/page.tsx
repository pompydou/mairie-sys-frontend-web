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
      <Card className="w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          {/* Left Side - Login Form */}
          <div className="flex-1 p-6 lg:p-8 bg-white">
            <div className="max-w-sm mx-auto">
              {/* Logo */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">CivicLink</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Accédez à votre espace administratif</h1>
                <p className="text-gray-600">Bienvenue ! Veuillez vous connecter pour accéder aux services municipaux :</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="mb-3">
                  <Input
                    type="email"
                    placeholder="Adresse e-mail"
                    className="h-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="mb-3 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="h-10 pr-10"
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
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 mb-3" disabled={isLoading}>
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Créer un compte
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 p-6 lg:p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-12 left-12 w-16 h-24 bg-white rounded-sm"></div>
              <div className="absolute bottom-12 right-12 w-14 h-20 bg-white rounded-sm"></div>
              <div className="absolute top-1/3 left-6 w-12 h-18 bg-white rounded-sm"></div>
            </div>

            <div className="relative z-10 text-center max-w-md">
              {/* Illustration Area */}
              <div className="mb-8 relative">
                {/* Dashboard mockup */}
                <div className="bg-white rounded-lg p-3 shadow-xl mb-4 mx-auto w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Floating app icons */}
                <div className="absolute -left-6 top-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>

                <div className="absolute -right-6 top-12">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>

                <div className="absolute -left-3 bottom-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <h2 className="text-xl font-bold mb-3">Services municipaux intégrés</h2>
              <p className="text-blue-100 mb-4 text-sm">Accédez à tous les services administratifs de votre municipalité depuis un tableau de bord unifié.</p>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-white rounded-sm flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div className="w-2.5 h-2.5 bg-white/50 rounded-sm flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 text-blue-600/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div className="w-2.5 h-2.5 bg-white/50 rounded-sm flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 text-blue-600/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}