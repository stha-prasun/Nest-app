import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, HealthModule, PrismaModule],
})
export class AppModule {}
