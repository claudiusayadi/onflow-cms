import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import redisConfig, { REDIS_CLIENT } from 'src/config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => new Redis(redisConfig),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
