import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  editUserBalance(id: string, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        balance: amount,
      },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
