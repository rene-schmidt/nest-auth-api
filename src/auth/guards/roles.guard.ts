import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard responsible for role-based access control.
 *
 * Determines whether the authenticated user has at least one
 * of the roles required to access a given route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the current request can proceed.
   *
   * - Retrieves required roles from route or controller metadata
   * - Allows access if no roles are specified
   * - Validates that the authenticated user has a matching role
   *
   * @param context Execution context containing request and handler metadata
   * @returns `true` if access is granted, otherwise `false`
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve roles defined via the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are defined, allow access
    if (!requiredRoles) return true;

    // Extract the HTTP request and authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Grant access if the user exists and has a required role
    return !!user && requiredRoles.includes(user.role);
  }
}
