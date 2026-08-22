import { Module, Global } from '@nestjs/common';
import { SwaggerConfigModule } from './swagger/swagger.module';

@Global()
@Module({
  imports: [SwaggerConfigModule],
  exports: [SwaggerConfigModule],
})
export class CommonModule {}
