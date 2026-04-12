// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { FilmsModule } from './films';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    LoggerModule.forRoot(),
    DatabaseModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    FilmsModule.register(),
    OrderModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
