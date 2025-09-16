"use client"

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { authService } from '@/lib/auth-service'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status only on client side
    const auth = authService.checkAuthStatus()
    
    if (!auth.isAuthenticated) {
      // Redirect to login if not authenticated
      redirect('/login')
    } else {
      // Redirect to role-specific dashboard
      const redirectPath = authService.getRedirectPath(auth.user?.role || '')
      // Only redirect if we're not already on the correct path
      if (redirectPath !== '/dashboard') {
        redirect(redirectPath)
      } else {
        // If role doesn't match any specific path, show a simple dashboard
        setLoading(false)
      }
    }
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Bienvenue dans votre espace personnel</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Vous êtes connecté, mais votre rôle ne correspond à aucun tableau de bord spécifique.</p>
        </div>
      </div>
    </div>
  )
}