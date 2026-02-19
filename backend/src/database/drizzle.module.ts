import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DrizzleService } from './drizzle.service';

export const DRIZZLE = Symbol('DRIZZLE');
export type Drizzle = PostgresJsDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    DrizzleService,
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const client = postgres(databaseUrl);
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE, DrizzleService],
})
export class DrizzleModule {}
