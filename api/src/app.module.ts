import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from 'src/config/env.validation';
import { apiProviders } from 'src/config/providers.config';
import throttlerConfig from 'src/config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync(throttlerConfig.asProvider()),
  ],
  controllers: [],
  providers: [...apiProviders],
})
export class AppModule {}
