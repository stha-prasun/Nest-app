import type { RefreshToken } from '../entities/refresh-token.entity.js';

export interface IRefreshTokenRepository {
  create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
