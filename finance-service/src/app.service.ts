import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Finance Service is running! 🚀';
  }

  getHealth(): string {
    return 'Finance Service is healthy! 🏥';
  }
}
