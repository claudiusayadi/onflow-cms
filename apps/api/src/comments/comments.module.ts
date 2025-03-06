import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CommentsResolver, CommentsService, PrismaService],
  // exports: [CommentsService],
})
export class CommentsModule {}
