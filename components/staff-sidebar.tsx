"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Building, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Package, 
  History,
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

const staffSidebar: SidebarItem[] = [
  {
    title: "Tableau de bord",
    icon: "dashboard",
    path: "/staff/dashboard",
    permissions: ["municipal:read", "municipal:write"]
  },
  {
    title: "Mes tâches",
    icon: "tasks",
    path: "/staff/tasks",
    permissions: ["municipal:read", "municipal:write"],
    children: [
      {
        title: "Tâches du jour",
        path: "/staff/tasks/daily"
      },
      {
        title: "Tâches de la semaine",
        path: "/staff/tasks/weekly"
      },
      {
        title: "Demandes en attente",
        path: "/staff/tasks/pending"
      }
    ]
  },
  {
    title: "Indicateurs personnels",
    icon: "indicators",
    path: "/staff/indicators",
    permissions: ["municipal:read"]
  },
  {
    title: "Services administratifs",
    icon: "administration",
    path: "/staff/admin-services",
    permissions: ["service:manage", "service:write"],
    children: [
      {
        title: "Actes de naissance",
        path: "/staff/admin-services/birth-certificates"
      },
      {
        title: "Actes de mariage",
        path: "/staff/admin-services/marriage-certificates"
      },
      {
        title: "Actes de décès",
        path: "/staff/admin-services/death-certificates"
      },
      {
        title: "Formulaires numériques",
        path: "/staff/admin-services/forms"
      }
    ]
  },
  {
    title: "Gestion des rendez-vous",
    icon: "appointments",
    path: "/staff/appointments",
    permissions: ["service:manage"],
    children: [
      {
        title: "Agenda des services",
        path: "/staff/appointments/agenda"
      },
      {
        title: "Disponibilités",
        path: "/staff/appointments/availability"
      },
      {
        title: "File d'attente",
        path: "/staff/appointments/queue"
      },
      {
        title: "Rappels & notifications",
        path: "/staff/appointments/reminders"
      }
    ]
  },
  {
    title: "Gestion documentaire",
    icon: "documents",
    path: "/staff/documents",
    permissions: ["document:manage"],
    children: [
      {
        title: "Génération de certificats",
        path: "/staff/documents/certificates"
      },
      {
        title: "Modèles & tampons",
        path: "/staff/documents/templates"
      },
      {
        title: "Archivage & recherche",
        path: "/staff/documents/archive"
      }
    ]
  },
  {
    title: "Communication",
    icon: "communication",
    path: "/staff/communication",
    permissions: ["municipal:read"],
    children: [
      {
        title: "Messages internes",
        path: "/staff/communication/internal"
      },
      {
        title: "Correspondance citoyenne",
        path: "/staff/communication/citizen"
      },
      {
        title: "Notifications",
        path: "/staff/communication/notifications"
      }
    ]
  },
  {
    title: "Ressources & logistique",
    icon: "resources",
    path: "/staff/resources",
    permissions: ["municipal:read"],
    children: [
      {
        title: "Inventaire",
        path: "/staff/resources/inventory"
      },
      {
        title: "Équipements",
        path: "/staff/resources/equipment"
      },
      {
        title: "Maintenance",
        path: "/staff/resources/maintenance"
      }
    ]
  },
  {
    title: "Historique",
    icon: "history",
    path: "/staff/history",
    permissions: ["municipal:read"],
    children: [
      {
        title: "Demandes traitées",
        path: "/staff/history/requests"
      },
      {
        title: "Statistiques individuelles",
        path: "/staff/history/stats"
      }
    ]
  }
]

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "dashboard": return LayoutDashboard
    case "tasks": return CheckSquare
    case "indicators": return BarChart3
    case "administration": return Building
    case "appointments": return Calendar
    case "documents": return FileText
    case "communication": return MessageSquare
    case "resources": return Package
    case "history": return History
    default: return LayoutDashboard
  }
}

export function StaffSidebar() {
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
            {staffSidebar.map((item) => {
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