interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  department: string
  position: string
  phone: string
  is_active: boolean
  last_login_at: string
  content_permissions: string[]
}

interface Tenant {
  id: string
  name: string
  slug: string
}

interface LoginResponse {
  token: string
  user: User
  tenant: Tenant
}

interface AuthResult {
  success: boolean
  user?: User
  tenant?: Tenant
  error?: string
}

class AuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/graphql"

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                user {
                  id
                  email
                  first_name
                  last_name
                  role
                  department
                  position
                  phone
                  is_active
                  last_login_at
                  content_permissions
                }
                tenant {
                  id
                  name
                  slug
                }
              }
            }
          `,
          variables: { email, password },
        }),
      })

      const data = await response.json()

      if (data.errors) {
        return { success: false, error: data.errors[0].message }
      }

      const { token, user, tenant } = data.data.login

      // Stockage des données d'authentification
      localStorage.setItem("authToken", token)
      localStorage.setItem("userData", JSON.stringify(user))
      localStorage.setItem("tenantData", JSON.stringify(tenant))
      localStorage.setItem("lastLogin", new Date().toISOString())

      return { success: true, user, tenant }
    } catch (error) {
      return { success: false, error: "Erreur de connexion au serveur" }
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation Logout {
                logout
              }
            `,
          }),
        })
      }
    } catch (error) {
      console.warn("Erreur lors de la déconnexion côté serveur:", error)
    } finally {
      // Nettoyage local
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      localStorage.removeItem("tenantData")
      localStorage.removeItem("lastLogin")
    }
  }

  checkAuthStatus(): { isAuthenticated: boolean; user?: User; tenant?: Tenant; token?: string } {
    // Vérifier si on est côté client (localStorage est disponible)
    if (typeof window === 'undefined') {
      return { isAuthenticated: false }
    }

    try {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("userData")
      const tenantData = localStorage.getItem("tenantData")

      if (token && userData && tenantData) {
        // Vérifier l'expiration du token
        const payload = JSON.parse(atob(token.split(".")[1]))
        const currentTime = Math.floor(Date.now() / 1000)

        if (payload.exp > currentTime) {
          return {
            isAuthenticated: true,
            user: JSON.parse(userData),
            tenant: JSON.parse(tenantData),
            token: token,
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error)
    }

    return { isAuthenticated: false }
  }

  getRedirectPath(userRole: string): string {
    const roleRedirects: Record<string, string> = {
      SUPER_ADMIN: "/admin/dashboard",
      MAIRE: "/mayor/dashboard",
      CHEF_SERVICE: "/manager/dashboard",
      AGENT_MUNICIPAL: "/staff/dashboard",
      OPERATEUR: "/operator/dashboard",
      CITOYEN: "/citizen/dashboard",
    }

    return roleRedirects[userRole] || "/dashboard"
  }
}

export const authService = new AuthService()
