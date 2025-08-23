import { RegistryDates } from 'src/common/dto/registry-dates.dto';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
