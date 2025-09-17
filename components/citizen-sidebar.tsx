"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Building, 
  Calendar, 
  FileText, 
  Bell, 
  User,
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

const citizenSidebar: SidebarItem[] = [
  {
    title: "Tableau de bord",
    icon: "dashboard",
    path: "/citizen/dashboard",
    permissions: []
  },
  {
    title: "Mes services",
    icon: "services",
    path: "/citizen/services",
    permissions: [],
    children: [
      {
        title: "Demandes en cours",
        path: "/citizen/services/requests"
      },
      {
        title: "Historique des demandes",
        path: "/citizen/services/history"
      },
      {
        title: "Services disponibles",
        path: "/citizen/services/available"
      }
    ]
  },
  {
    title: "Mes rendez-vous",
    icon: "appointments",
    path: "/citizen/appointments",
    permissions: [],
    children: [
      {
        title: "Rendez-vous à venir",
        path: "/citizen/appointments/upcoming"
      },
      {
        title: "Historique",
        path: "/citizen/appointments/history"
      },
      {
        title: "Prendre un rendez-vous",
        path: "/citizen/appointments/book"
      }
    ]
  },
  {
    title: "Documents",
    icon: "documents",
    path: "/citizen/documents",
    permissions: [],
    children: [
      {
        title: "Mes documents",
        path: "/citizen/documents/my-docs"
      },
      {
        title: "Documents publics",
        path: "/citizen/documents/public"
      }
    ]
  },
  {
    title: "Notifications",
    icon: "notifications",
    path: "/citizen/notifications",
    permissions: []
  },
  {
    title: "Profil",
    icon: "profile",
    path: "/citizen/profile",
    permissions: [],
    children: [
      {
        title: "Informations personnelles",
        path: "/citizen/profile/info"
      },
      {
        title: "Sécurité",
        path: "/citizen/profile/security"
      },
      {
        title: "Préférences",
        path: "/citizen/profile/preferences"
      }
    ]
  }
]

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "dashboard": return LayoutDashboard
    case "services": return Building
    case "appointments": return Calendar
    case "documents": return FileText
    case "notifications": return Bell
    case "profile": return User
    default: return LayoutDashboard
  }
}

export function CitizenSidebar() {
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
          <div className="w-6 h-6 bg-green-800 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-semibold text-gray-900">CivicLink</span>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-800 font-semibold">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Citoyen
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2">
          <ul className="space-y-1">
            {citizenSidebar.map((item) => {
              const IconComponent = getIconComponent(item.icon)
              const isOpen = openMenus[item.path]
              const isActive = pathname === item.path

              return (
                <li key={item.path}>
                  <div>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
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
                                    ? "bg-green-50 text-green-700 hover:bg-green-50" 
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