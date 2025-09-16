// Vérifier le rôle de l'utilisateur
export function checkUserRole(userRole: string): string {
  switch(userRole) {
    case 'SUPER_ADMIN':
      return "L'utilisateur est un administrateur système";
    case 'MAIRE':
      return "L'utilisateur est un maire";
    case 'CHEF_SERVICE':
      return "L'utilisateur est un chef de service";
    case 'AGENT_MUNICIPAL':
      return "L'utilisateur est un agent municipal";
    case 'OPERATEUR':
      return "L'utilisateur est un opérateur";
    case 'CITOYEN':
      return "L'utilisateur est un citoyen";
    default:
      return "Rôle inconnu";
  }
}

// Redirection selon le rôle
export function redirectBasedOnRole(userRole: string): string {
  const roleRedirects: Record<string, string> = {
    'SUPER_ADMIN': '/admin/dashboard',
    'MAIRE': '/mayor/dashboard',
    'CHEF_SERVICE': '/manager/dashboard',
    'AGENT_MUNICIPAL': '/staff/dashboard',
    'OPERATEUR': '/operator/dashboard',
    'CITOYEN': '/citizen/dashboard'
  };

  return roleRedirects[userRole] || '/dashboard';
}

// Vérification spécifique pour le maire
export function isUserMayor(userRole: string): boolean {
  return userRole === 'MAIRE';
}

// Vérification spécifique pour l'administrateur système
export function isUserSuperAdmin(userRole: string): boolean {
  return userRole === 'SUPER_ADMIN';
}

// Vérification spécifique pour le chef de service
export function isUserManager(userRole: string): boolean {
  return userRole === 'CHEF_SERVICE';
}

// Vérification spécifique pour l'agent municipal
export function isUserStaff(userRole: string): boolean {
  return userRole === 'AGENT_MUNICIPAL';
}

// Vérification spécifique pour l'opérateur
export function isUserOperator(userRole: string): boolean {
  return userRole === 'OPERATEUR';
}

// Vérification spécifique pour le citoyen
export function isUserCitizen(userRole: string): boolean {
  return userRole === 'CITOYEN';
}