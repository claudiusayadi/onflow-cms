import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ApiConfig } from './app.config';

export default registerAs('jwt', () => {
  const config = {
    secret: ApiConfig.JWT_SECRET,
    signOptions: {
      expiresIn: ApiConfig.JWT_TTL,
    },
    refreshSecret: ApiConfig.JWT_REFRESH_SECRET,
    refreshTtl: ApiConfig.JWT_REFRESH_TTL,
  } as const satisfies JwtModuleOptions & {
    refreshSecret: string;
    refreshTtl: string | number;
  };
  return config;
});
