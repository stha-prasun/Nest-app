import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity.js';
import { RegisterDto } from '../dto/register.dto.js';

@Injectable()
export class UserFactory {
  async create(dto: RegisterDto): Promise<User> {
    const user = new User();

    user.id = randomUUID();
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 12);
    user.createdAt = new Date();

    return user;
  }
}
