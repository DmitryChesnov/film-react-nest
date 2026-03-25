import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'film_user'),
        password: configService.get('DATABASE_PASSWORD', 'film_password'),
        database: configService.get('DATABASE_NAME', 'film_db'),
        entities: [Film, Schedule],
        synchronize: false,
        logging: configService.get('DEBUG', '') === '*',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
