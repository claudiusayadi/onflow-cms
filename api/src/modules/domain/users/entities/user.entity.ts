import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RegistryDates } from 'src/common/dto/registry-dates.dto';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
import { UserRole } from '../enums/user-roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 'avatar.jpg', nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'role',
    default: UserRole.READER,
  })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon.hash(this.password);
    }
  }

  async compare(password: string): Promise<boolean> {
    if (!this.password) throw new Error('User password hash is missing');
    if (!password) throw new Error('Password to compare is missing');
    return await argon.verify(this.password, password);
  }

  get isDeleted() {
    return !!this.registryDates.deletedAt;
  }
}
