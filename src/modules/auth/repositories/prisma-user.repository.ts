import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { IUserRepository } from '../interfaces/user-repository.interface.js';
import type { User } from '../entities/user.entity.js';
import type { UserResponseDto } from '../dto/user-response.dto.js';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });
  }

  async create(data: {
    email: string;
    password: string;
  }): Promise<UserResponseDto> {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, createdAt: true },
    });
  }
}
