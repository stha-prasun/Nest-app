import { Module, Global } from '@nestjs/common';
import { SwaggerConfigModule } from './swagger/swagger.module';
import { AbacGuard } from './guards/abac.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
  imports: [SwaggerConfigModule],
  providers: [AbacGuard, JwtAuthGuard],
  exports: [SwaggerConfigModule, AbacGuard, JwtAuthGuard],
})
export class CommonModule {}
