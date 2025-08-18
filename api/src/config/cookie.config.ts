import { ApiConfig } from './env.validation';

export default {
  secure: true,
  httpOnly: true,
  sameSite: true,
  maxAge: ApiConfig.JWT_TTL,
};
