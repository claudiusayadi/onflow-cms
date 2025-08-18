import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-roles.enum';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export interface IRequestUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
}
