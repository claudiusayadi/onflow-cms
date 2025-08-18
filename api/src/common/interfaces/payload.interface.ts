import { UserRole } from 'src/modules/domain/users/enums/user-roles.enum';

export interface IPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  role: UserRole;
}
