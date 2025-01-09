import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS } from './constants/cors';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(CORS);
  app.setGlobalPrefix('api/v1');
  app.use(morgan('dev'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
