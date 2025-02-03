import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as tags from '../tags/tags.schema';
import * as posts from '../posts/posts.schema';
import * as users from '../users/users.schema';
import * as comments from '../comments/comments.schema';

export const DRIZZLE = Symbol('Drizzle-ORM-Database-Connection');

export const DbProvider = [
  {
    provide: DRIZZLE,
    // eslint-disable-next-line @typescript-eslint/require-await
    useFactory: async (configService: ConfigService) => {
      const pool = new Pool({
        connectionString: configService.getOrThrow('DATABASE_URL'),
      });
      const db = drizzle(pool, {
        schema: { ...users, ...posts, ...comments, ...tags },
      });

      return db;
    },
    inject: [ConfigService],
    exports: [DRIZZLE],
  },
];
