import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { configProvider } from './app.config.provider';
import { FilmsModule } from './films';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    FilmsModule.register(),
    OrderModule,
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
