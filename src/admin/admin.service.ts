import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service responsible for administrative user management operations.
 *
 * Provides functionality reserved for administrators, such as
 * modifying user balances and deleting user accounts.
 */
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Updates the balance of a specific user.
   *
   * @param id Unique user ID
   * @param amount New balance amount to be set
   * @returns The updated user entity
   */
  editUserBalance(id: string, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        balance: amount,
      },
    });
  }

  /**
   * Permanently deletes a user from the database.
   *
   * @param id Unique user ID
   * @returns The deleted user entity
   */
  deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
