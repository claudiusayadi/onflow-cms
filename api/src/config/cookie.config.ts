import { ApiConfig } from './app.config';

export default {
  access: {
    secure: true,
    httpOnly: true,
    sameSite: true,
    maxAge: ApiConfig.JWT_TTL * 1000, // cookies maxAge is in ms
  },
  refresh: {
    secure: true,
    httpOnly: true,
    sameSite: true,
    maxAge: ApiConfig.JWT_REFRESH_TTL * 1000, // cookies maxAge is in ms
  },
};
