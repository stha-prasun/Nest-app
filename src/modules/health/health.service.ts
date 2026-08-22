import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return 'App is running!';
  }
}
