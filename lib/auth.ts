import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple authentication context
 * In production, this would validate JWT tokens or sessions
 */
export interface AuthContext {
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  isAuthenticated: boolean;
}

/**
 * Extract auth context from request
 * For now, uses headers for demonstration
 * In production, validate JWT tokens from Authorization header
 */
export function getAuthContext(request: NextRequest): AuthContext {
  // For development/demo: Check custom headers
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role') as 'admin' | 'editor' | 'viewer' | null;

  if (!userId) {
    return {
      userId: 'system',
      role: 'admin', // Default to admin for backwards compatibility during migration
      isAuthenticated: false,
    };
  }

  return {
    userId,
    role: role || 'viewer',
    isAuthenticated: true,
  };
}

/**
 * Middleware to require authentication
 * Returns 401 Unauthorized if not authenticated
 */
export function requireAuth(context: AuthContext) {
  if (!context.isAuthenticated) {
    return {
      error: 'Unauthorized. Please log in to access this resource.',
      status: 401,
    };
  }
  return null;
}

/**
 * Middleware to require specific roles
 * Returns 403 Forbidden if user doesn't have required role
 */
export function requireRole(context: AuthContext, ...allowedRoles: AuthContext['role'][]) {
  if (!context.isAuthenticated) {
    return {
      error: 'Unauthorized',
      status: 401,
    };
  }

  if (!allowedRoles.includes(context.role)) {
    return {
      error: `Forbidden. Required roles: ${allowedRoles.join(', ')}`,
      status: 403,
    };
  }

  return null;
}

/**
 * Helper to create error response
 */
export function createAuthError(
  message: string,
  status: 401 | 403 = 401
): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  );
}
