import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Controller responsible for authentication-related HTTP endpoints.
 *
 * Handles user registration, login, token refresh, logout,
 * and authenticated user introspection.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user account.
   *
   * Expects an email and password in the request body.
   *
   * @param body Request body containing user credentials
   * @returns Created user data and authentication tokens
   */
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body.email, body.password);
  }

  /**
   * Authenticates a user and returns authentication tokens.
   *
   * Expects an email and password in the request body.
   *
   * @param body Request body containing login credentials
   * @returns Authenticated user data and authentication tokens
   */
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Returns information about the currently authenticated user.
   *
   * Access is protected by JWT authentication.
   * The response differs based on the user's role.
   *
   * @param req HTTP request containing the authenticated user payload
   * @returns A role-specific welcome message
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    // Check user role attached by the JWT authentication guard
    if (req.user.role === 'ADMIN') {
      return {
        message: 'Welcome admin',
      };
    } else {
      return {
        message: 'Welcome user',
      };
    }
  }

  /**
   * Issues new authentication tokens using a refresh token.
   *
   * Expects a refresh token in the request body.
   *
   * @param body Request body containing the refresh token
   * @returns New access and refresh tokens
   */
  @Post('refresh')
  refresh(@Body() body: any) {
    return this.authService.refresh(body.refreshToken);
  }

  /**
   * Logs out the user by invalidating their refresh token.
   *
   * Expects a refresh token in the request body.
   *
   * @param body Request body containing the refresh token
   * @returns Logout confirmation message
   */
  @Post('logout')
  logout(@Body() body: any) {
    return this.authService.logout(body.refreshToken);
  }
}
