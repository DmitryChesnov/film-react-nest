import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerFactory } from './logger/logger.factory';

async function bootstrap() {
  // Создаем логгер до инициализации приложения
  const logger = LoggerFactory.createLogger();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(3000);

  logger.log(`🚀 Application is running on: http://localhost:3000`);
  logger.log(`📊 Log format: ${LoggerFactory.getLoggerType()}`);
}

bootstrap();
