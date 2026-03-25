import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { PostgresFilmsRepository } from './repository/postgres.films.repository';
import { Film as FilmEntity } from '../entities/film.entity';
import { Schedule as ScheduleEntity } from '../entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    PostgresFilmsRepository,
    {
      provide: 'FILMS_REPOSITORY',
      useFactory: (
        configService: ConfigService,
        postgresRepo: PostgresFilmsRepository,
      ) => {
        console.log('🔵 Using PostgreSQL database');
        return postgresRepo;
      },
      inject: [ConfigService, PostgresFilmsRepository],
    },
  ],
  exports: [FilmsService],
})
export class FilmsModulePostgres {}
