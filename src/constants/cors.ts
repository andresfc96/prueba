import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: '*',
  methods: 'GET, POST, PATCH, OPTIONS, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
  exposedHeaders: ['Authorization'],
};
