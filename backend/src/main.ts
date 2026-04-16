import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });
  
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  
  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
  console.log(`📡 API endpoint: http://localhost:3000/api/afisha/films`);
}

bootstrap();