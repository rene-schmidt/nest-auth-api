import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service responsible for all user-related database operations.
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user in the database.
   *
   * @param data User creation data
   * @param data.email User's email address
   * @param data.passwordHash Hashed user password
   * @returns The created user entity
   */
  createUser(data: { email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: 'USER',
      },
    });
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id Unique user ID
   * @returns The user if found, otherwise `null`
   */
  getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param email User email address
   * @returns The user if found, otherwise `null`
   */
  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Retrieves the current account balance of a user.
   *
   * @param userId Unique user ID
   * @returns An object containing the user's balance
   */
  getBalance(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });
  }

  /**
   * Sets or removes the refresh token hash for a user.
   *
   * @param userId Unique user ID
   * @param refreshTokenHash Hashed refresh token or `null` to remove it
   * @returns The updated user entity
   */
  setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }
}
