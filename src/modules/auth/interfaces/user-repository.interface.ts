import type { User } from '../entities/user.entity.js';
import type { UserResponseDto } from '../dto/user-response.dto.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserResponseDto | null>;
  create(data: { email: string; password: string }): Promise<UserResponseDto>;
}
