import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE, Drizzle } from './drizzle.module';

@Injectable()
export class DrizzleService {
  constructor(@Inject(DRIZZLE) private db: Drizzle) {}

  getDb(): Drizzle {
    return this.db;
  }
}
