import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ApiConfig } from './env.validation';

export default registerAs('jwt', () => {
  const config = {
    secret: ApiConfig.JWT_SECRET,
    signOptions: {
      expiresIn: ApiConfig.JWT_TTL,
    },
  } as const satisfies JwtModuleOptions;
  return config;
});
