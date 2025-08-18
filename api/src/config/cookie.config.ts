import { ApiConfig } from './app.config';

export default {
  secure: true,
  httpOnly: true,
  sameSite: true,
  maxAge: ApiConfig.JWT_TTL,
};
