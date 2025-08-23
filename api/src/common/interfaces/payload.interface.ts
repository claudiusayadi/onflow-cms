import { UserRole } from 'src/modules/domain/users/enums/user-roles.enum';

export interface IPayload {
  sub: string;
  email: string;
  role: UserRole;
}
