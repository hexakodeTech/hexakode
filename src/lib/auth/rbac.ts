export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['/admin/*', '/studio/*'],
  ADMIN: [
    '/admin/dashboard',
    '/admin/enquiries',
    '/admin/cms',
    '/admin/settings',
    '/admin/settings/*',
    '/studio/*',
  ],
  OPERATOR: ['/admin/dashboard', '/admin/enquiries'],
  VIEWER: ['/admin/dashboard'],
};

/**
 * Checks if a normalized role has access to a specific pathname.
 * Normalizes role names (e.g. "Super Admin" -> "SUPER_ADMIN").
 */
export function hasAccess(roleName: string, pathname: string): boolean {
  const normalizedRole = roleName.toUpperCase().replace(/\s+/g, '_');
  const allowed = ROLE_PERMISSIONS[normalizedRole];
  if (!allowed) return false;

  return allowed.some((pattern) => {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1); // e.g. '/admin/'
      return pathname.startsWith(prefix) || pathname === prefix.slice(0, -1);
    }
    return pathname === pattern;
  });
}

/**
 * Returns a rank value for the role hierarchy (higher is more privileged).
 */
export function getRoleHierarchy(roleName: string): number {
  const normalizedRole = roleName.toUpperCase().replace(/\s+/g, '_');
  switch (normalizedRole) {
    case 'SUPER_ADMIN':
      return 4;
    case 'ADMIN':
      return 3;
    case 'OPERATOR':
      return 2;
    case 'VIEWER':
      return 1;
    default:
      return 0;
  }
}
