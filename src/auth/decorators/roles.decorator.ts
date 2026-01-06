import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to store required roles for a route or controller.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator used to define required roles for a route or controller.
 *
 * The roles defined here are later retrieved by the RolesGuard
 * to perform role-based access control.
 *
 * @param roles One or more roles allowed to access the route
 * @example
 * ```ts
 * @Roles('ADMIN')
 * @Get('admin')
 * getAdminData() {}
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
