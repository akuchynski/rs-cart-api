import { Pool } from 'pg';
import { Module } from '@nestjs/common';
import { PG_CONNECTION } from '../common/constants';

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: process.env.PG_USERNAME,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: +process.env.PG_PORT,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
