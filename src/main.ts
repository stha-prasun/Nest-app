import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { SwaggerService } from './common/swagger/swagger.service';
import { LoggerMiddleware } from './common/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: ['api/docs'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const logger = new LoggerMiddleware();
  app.use((req: Request, res: Response, next: NextFunction) =>
    logger.use(req, res, next),
  );

  const swaggerService = app.get(SwaggerService);
  swaggerService.setup(app);

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger is running on: http://localhost:${port}/api/docs`);
}
void bootstrap();
