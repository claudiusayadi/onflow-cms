import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RegistryDates } from 'src/common/dtos/registry-dates.dto';
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

  // @Column({ name: 'password_changed_at', nullable: true })
  // @Exclude()
  // passwordChangedAt?: Date;

  // @Column({ name: 'password_reset_token', nullable: true })
  // @Exclude()
  // passwordResetToken?: string;

  // @Column({ name: 'password_reset_expires', nullable: true })
  // @Exclude()
  // passwordResetExpires?: Date;

  // @Column({ default: true })
  // @Exclude()
  // isActive: boolean;

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

  // changedPasswordAfter(JWTTimestamp: number): boolean {
  //   if (!this.passwordChangedAt) return false;

  //   const changedTimestamp = parseInt(
  //     (this.passwordChangedAt.getTime() / 1000).toString(),
  //     10,
  //   );
  //   return JWTTimestamp < changedTimestamp;
  // }

  get isDeleted() {
    return !!this.registryDates.deletedAt;
  }
}
