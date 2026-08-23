import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CommonModule, HealthModule, PrismaModule, AuthModule],
})
export class AppModule {}
