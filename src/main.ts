import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BASE_CONFIG } from './index.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/^(.*)/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
  });
  app.use(cookieParser());
  await app.listen(BASE_CONFIG.PORT);
}
bootstrap();
