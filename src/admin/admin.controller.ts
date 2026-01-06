import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Controller responsible for administrative user management endpoints.
 *
 * All routes in this controller are protected and accessible
 * only to users with the ADMIN role.
 */
@Controller('admin/users')
export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * Deletes a user by their unique identifier.
   *
   * Access is restricted to authenticated users with the ADMIN role.
   *
   * @param id Unique user ID extracted from the route parameter
   * @returns The deleted user entity
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  /**
   * Updates the balance of a specific user.
   *
   * Access is restricted to authenticated users with the ADMIN role.
   *
   * @param id Unique user ID extracted from the route parameter
   * @param amount New balance amount provided in the request body
   * @returns The updated user entity
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/balance')
  editBalance(@Param('id') id: string, @Body('amount') amount: number) {
    return this.adminService.editUserBalance(id, amount);
  }
}
