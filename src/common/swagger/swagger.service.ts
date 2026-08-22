import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Nest App')
      .setDescription('Nest App API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
