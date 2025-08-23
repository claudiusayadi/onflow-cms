import { ApiConfig } from 'src/config/app.config';

export default {
  host: ApiConfig.REDIS_HOST,
  port: ApiConfig.REDIS_PORT,
};

export const REDIS_CLIENT = 'REDIS_CLIENT';
