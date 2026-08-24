import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from '@common/strategies/jwt.strategy';
import { PrismaUserRepository } from './repositories/prisma-user.repository.js';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository.js';
import { UserFactory } from './factories/user.factory.js';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
} from './constants/auth.constants.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRY },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserFactory,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

const ACCESS_TOKEN_EXPIRY = 900;
