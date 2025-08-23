import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from 'src/config/app.config';
import { apiProviders } from 'src/config/providers.config';
import throttlerConfig from 'src/config/throttler.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DbModule } from 'src/modules/db/db.module';
import { UsersModule } from 'src/modules/domain/users/users.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { CommentsModule } from './modules/domain/comments/comments.module';
import { PostsModule } from './modules/domain/posts/posts.module';
import { TagsModule } from './modules/domain/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync(throttlerConfig.asProvider()),
    AuthModule,
    DbModule,
    UsersModule,
    RedisModule,
    PostsModule,
    TagsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [...apiProviders],
})
export class AppModule {}
