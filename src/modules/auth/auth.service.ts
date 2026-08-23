import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
} from './constants/auth.constants.js';
import type { IUserRepository } from './interfaces/user-repository.interface.js';
import type { IRefreshTokenRepository } from './interfaces/refresh-token-repository.interface.js';
import { UserFactory } from './factories/user.factory.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly userFactory: UserFactory,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.userFactory.create({
      email: dto.email,
      password: dto.password,
    });

    const saved = await this.userRepository.create({
      email: user.email,
      password: user.password,
    });

    return this.generateTokens(saved.id, saved.email);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const stored = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > stored.expiresAt) {
      await this.refreshTokenRepository.revoke(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokenRepository.revoke(refreshToken);

    const user = await this.userRepository.findById(stored.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id, user.email);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.revoke(refreshToken);
  }

  async logoutAll(userId: string) {
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
    });

    const refreshToken = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId,
      expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
