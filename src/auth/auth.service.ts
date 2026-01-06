import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for authentication and authorization logic.
 *
 * Handles user registration, login, token issuing, token refreshing,
 * and logout functionality.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Generates a new access token and refresh token for a user.
   *
   * @param user Authenticated user data
   * @returns An object containing access and refresh tokens
   */
  private async signTokens(user: { id: string; email: string; role: string }) {
    // JWT payload containing user identity and role
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Create short-lived access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // Create long-lived refresh token
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Registers a new user.
   *
   * - Validates that the email is not already in use
   * - Hashes the user's password
   * - Creates a new user record
   * - Issues access and refresh tokens
   * - Stores the hashed refresh token
   *
   * @param email User email address
   * @param password Plain-text password
   * @returns Public user data along with access and refresh tokens
   */
  async register(email: string, password: string) {
    // Check if a user with the given email already exists
    const existing = await this.usersService.getUserByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    // Hash the user's password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    // Create a new user record
    const user = await this.usersService.createUser({ email, passwordHash });

    // Generate authentication tokens
    const tokens = await this.signTokens(user);

    // Hash and store the refresh token
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  /**
   * Authenticates a user using email and password.
   *
   * - Validates credentials
   * - Issues new access and refresh tokens
   * - Updates the stored refresh token hash
   *
   * @param email User email address
   * @param password Plain-text password
   * @returns Public user data along with access and refresh tokens
   */
  async login(email: string, password: string) {
    // Retrieve the user by email
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare provided password with stored hash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Generate authentication tokens
    const tokens = await this.signTokens(user);

    // Hash and store the new refresh token
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  /**
   * Refreshes access and refresh tokens using a valid refresh token.
   *
   * - Verifies the refresh token
   * - Ensures the token matches the stored hash
   * - Issues new tokens and rotates the refresh token
   *
   * @param refreshToken Refresh token provided by the client
   * @returns New access and refresh tokens
   */
  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    let payload: any;
    try {
      // Verify the refresh token signature and expiration
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Retrieve the user associated with the token
    const user = await this.usersService.getUserById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // Validate refresh token against stored hash
    const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    // Generate new tokens
    const tokens = await this.signTokens(user);

    // Rotate and store the new refresh token hash
    const newRefreshHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.usersService.setRefreshTokenHash(user.id, newRefreshHash);

    return tokens;
  }

  /**
   * Logs out a user by invalidating their refresh token.
   *
   * @param refreshToken Refresh token provided by the client
   * @returns Confirmation message
   */
  async logout(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    let payload: any;
    try {
      // Verify the refresh token
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Remove the stored refresh token hash
    await this.usersService.setRefreshTokenHash(payload.sub, null);

    return { message: 'logged out' };
  }

  /**
   * (Currently unused / placeholder)
   *
   * Verifies a refresh token and invalidates it.
   * The method name suggests fetching users, but the logic
   * currently performs a logout-like operation.
   *
   * @param refreshToken Refresh token provided by the client
   * @returns Confirmation message
   */
  async getUsers(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.usersService.setRefreshTokenHash(payload.sub, null);

    return { message: 'logged out' };
  }
}
