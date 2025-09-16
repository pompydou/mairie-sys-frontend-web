"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Building, 
  Shield, 
  Settings, 
  Monitor, 
  Rocket,
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react"
import { authService } from "@/lib/auth-service"
import { checkUserRole, isUserSuperAdmin } from "@/lib/role-utils"

interface SidebarItem {
  title: string
  icon: string
  path: string
  permissions: string[]
  children?: SidebarItem[]
}

const adminSidebar: SidebarItem[] = [
  {
    title: "Tableau de bord",
    icon: "dashboard",
    path: "/admin/dashboard",
    permissions: ["system:admin"]
  },
  {
    title: "État du système",
    icon: "status",
    path: "/admin/system-status",
    permissions: ["system:admin"],
    children: [
      {
        title: "Temps de réponse",
        path: "/admin/system-status/response-time"
      },
      {
        title: "Erreurs",
        path: "/admin/system-status/errors"
      },
      {
        title: "Logs",
        path: "/admin/system-status/logs"
      }
    ]
  },
  {
    title: "Performances globales",
    icon: "performance",
    path: "/admin/performance",
    permissions: ["system:admin"],
    children: [
      {
        title: "Utilisation des API",
        path: "/admin/performance/api"
      }
    ]
  },
  {
    title: "Gestion multi-communes",
    icon: "tenants",
    path: "/admin/tenants",
    permissions: ["tenant:manage"],
    children: [
      {
        title: "Configuration des municipalités",
        path: "/admin/tenants/configuration"
      },
      {
        title: "Branding",
        path: "/admin/tenants/branding"
      },
      {
        title: "Isolation des données",
        path: "/admin/tenants/isolation"
      }
    ]
  },
  {
    title: "Sécurité & conformité",
    icon: "security",
    path: "/admin/security",
    permissions: ["system:admin"],
    children: [
      {
        title: "Logs d'accès",
        path: "/admin/security/access-logs"
      },
      {
        title: "Événements de sécurité",
        path: "/admin/security/events"
      },
      {
        title: "Rapports de conformité",
        path: "/admin/security/compliance"
      }
    ]
  },
  {
    title: "Administration système",
    icon: "administration",
    path: "/admin/system-admin",
    permissions: ["system:admin"],
    children: [
      {
        title: "Gestion des utilisateurs",
        path: "/admin/system-admin/users"
      },
      {
        title: "Gestion des rôles",
        path: "/admin/system-admin/roles"
      },
      {
        title: "Permissions (RBAC)",
        path: "/admin/system-admin/permissions"
      },
      {
        title: "Base de données",
        path: "/admin/system-admin/database"
      },
      {
        title: "Sauvegardes",
        path: "/admin/system-admin/backups"
      }
    ]
  },
  {
    title: "Monitoring technique",
    icon: "monitoring",
    path: "/admin/monitoring",
    permissions: ["system:admin"],
    children: [
      {
        title: "Utilisation CPU/Mémoire",
        path: "/admin/monitoring/resources"
      },
      {
        title: "Trafic",
        path: "/admin/monitoring/traffic"
      },
      {
        title: "Optimisation",
        path: "/admin/monitoring/optimization"
      },
      {
        title: "Debugging",
        path: "/admin/monitoring/debugging"
      }
    ]
  },
  {
    title: "Déploiement & intégrations",
    icon: "deployment",
    path: "/admin/deployment",
    permissions: ["system:admin"],
    children: [
      {
        title: "Environnements",
        path: "/admin/deployment/environments"
      },
      {
        title: "Load balancing",
        path: "/admin/deployment/load-balancing"
      },
      {
        title: "Certificats SSL",
        path: "/admin/deployment/ssl"
      },
      {
        title: "Intégrations mobiles",
        path: "/admin/deployment/mobile"
      }
    ]
  }
]

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "dashboard": return LayoutDashboard
    case "status": return Activity
    case "performance": return BarChart3
    case "tenants": return Building
    case "security": return Shield
    case "administration": return Settings
    case "monitoring": return Monitor
    case "deployment": return Rocket
    default: return LayoutDashboard
  }
}

export function AdminSidebar() {
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

  // Vérifier si l'utilisateur est un administrateur système
  const canAccessAdminFeatures = user && isUserSuperAdmin(user.role);

  // Afficher un message si l'utilisateur n'a pas les droits
  if (user && !canAccessAdminFeatures) {
    return (
      <div className="flex h-full flex-col border-r bg-white">
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">dotwork</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-4">
              {checkUserRole(user.role)}
            </p>
            <p className="text-sm text-gray-500">
              Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => router.push("/")}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-semibold text-gray-900">dotwork</span>
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
                {user.position} - {checkUserRole(user.role)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2">
          <ul className="space-y-1">
            {adminSidebar.map((item) => {
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