"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  BarChart3, 
  Smile, 
  TrendingUp, 
  Wallet, 
  Construction, 
  Megaphone, 
  Users, 
  FileBarChart,
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react"
import { authService } from "@/lib/auth-service"

interface SidebarItem {
  title: string
  icon: string
  path: string
  permissions: string[]
  children?: SidebarItem[]
}

const mayorSidebar: SidebarItem[] = [
  {
    title: "Tableau de bord",
    icon: "dashboard",
    path: "/mayor/dashboard",
    permissions: ["municipal:admin"]
  },
  {
    title: "Vue d'ensemble stratégique",
    icon: "overview",
    path: "/mayor/overview",
    permissions: ["municipal:admin"]
  },
  {
    title: "Indicateurs de satisfaction",
    icon: "satisfaction",
    path: "/mayor/satisfaction",
    permissions: ["municipal:admin"]
  },
  {
    title: "Performance des services",
    icon: "performance",
    path: "/mayor/performance",
    permissions: ["municipal:admin"]
  },
  {
    title: "Suivi du budget",
    icon: "budget",
    path: "/mayor/budget",
    permissions: ["municipal:admin"],
    children: [
      {
        title: "Prévu vs Réalisé",
        path: "/mayor/budget/planning"
      },
      {
        title: "Rapports financiers",
        path: "/mayor/budget/reports"
      }
    ]
  },
  {
    title: "Projets & Infrastructures",
    icon: "projects",
    path: "/mayor/projects",
    permissions: ["municipal:admin"],
    children: [
      {
        title: "Grands projets",
        path: "/mayor/projects/major"
      },
      {
        title: "Projets stratégiques",
        path: "/mayor/projects/strategic"
      }
    ]
  },
  {
    title: "Communication publique",
    icon: "communication",
    path: "/mayor/communication",
    permissions: ["municipal:admin"],
    children: [
      {
        title: "Actualités",
        path: "/mayor/communication/news"
      },
      {
        title: "Annonces publiques",
        path: "/mayor/communication/announcements"
      },
      {
        title: "Alertes d'urgence",
        path: "/mayor/communication/emergency"
      }
    ]
  },
  {
    title: "Services citoyens",
    icon: "services",
    path: "/mayor/citizen-services",
    permissions: ["municipal:admin"],
    children: [
      {
        title: "Statistiques globales",
        path: "/mayor/citizen-services/stats"
      },
      {
        title: "Temps de traitement",
        path: "/mayor/citizen-services/timing"
      },
      {
        title: "Niveau de satisfaction",
        path: "/mayor/citizen-services/satisfaction"
      }
    ]
  },
  {
    title: "Performance & Indicateurs",
    icon: "analytics",
    path: "/mayor/analytics",
    permissions: ["municipal:admin"],
    children: [
      {
        title: "Efficacité des départements",
        path: "/mayor/analytics/efficiency"
      },
      {
        title: "Rapports comparatifs",
        path: "/mayor/analytics/comparative"
      },
      {
        title: "KPIs stratégiques",
        path: "/mayor/analytics/kpis"
      }
    ]
  }
]

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "dashboard": return LayoutDashboard
    case "overview": return BarChart3
    case "satisfaction": return Smile
    case "performance": return TrendingUp
    case "budget": return Wallet
    case "projects": return Construction
    case "communication": return Megaphone
    case "services": return Users
    case "analytics": return FileBarChart
    default: return LayoutDashboard
  }
}

export function MayorSidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const auth = authService.checkAuthStatus()
    if (auth.isAuthenticated) {
      setUser(auth.user)
    }
  }, [])

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  const handleLogout = async () => {
    await authService.logout()
    router.push("/login")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-semibold text-gray-900">CivicLink</span>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-semibold">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.position}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2">
          <ul className="space-y-1">
            {mayorSidebar.map((item) => {
              const IconComponent = getIconComponent(item.icon)
              const isOpen = openMenus[item.path]
              const isActive = pathname === item.path

              return (
                <li key={item.path}>
                  <div>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-50" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (item.children) {
                          toggleMenu(item.path)
                        } else {
                          handleNavigation(item.path)
                        }
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.children && (
                        isOpen ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>

                    {item.children && isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.path
                          return (
                            <li key={child.path}>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 px-3 py-2 h-auto text-sm ${
                                  isChildActive 
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50" 
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() => handleNavigation(child.path)}
                              >
                                <span className="flex-1 text-left">{child.title}</span>
                              </Button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 h-auto text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  )
}