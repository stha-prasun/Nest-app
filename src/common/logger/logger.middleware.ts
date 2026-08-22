import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const isSuccess = statusCode >= 200 && statusCode < 400;
      const color = isSuccess ? '\x1B[32m' : '\x1B[31m';
      const reset = '\x1B[0m';
      const timestamp = new Date().toISOString();

      console.log(
        `${color}[${timestamp}] ${method} ${originalUrl} ${statusCode} ${duration}ms${reset}`,
      );
    });

    next();
  }
}
