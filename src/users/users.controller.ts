import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controller responsible for user-related HTTP endpoints.
 */
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Returns the authenticated user's account balance.
   *
   * Access is protected by JWT authentication and role-based authorization.
   *
   * @param req HTTP request object containing the authenticated user payload
   * @returns The user's current balance
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('balance')
  getBalance(@Req() req: any) {
    // Extract the user ID from the authenticated request
    const userId = req.user.id;

    // Delegate the balance retrieval to the UsersService
    return this.usersService.getBalance(userId);
  }
}
