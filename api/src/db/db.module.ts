import { Module } from '@nestjs/common';
import { DbProvider } from './db.provider';

@Module({
  providers: [...DbProvider],
})
export class DbModule {}
