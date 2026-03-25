import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schemas/film.schema';
import { MongodbFilmsRepository } from './repository/mongodb.films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    MongodbFilmsRepository,
    {
      provide: 'FILMS_REPOSITORY',
      useFactory: (
        configService: ConfigService,
        mongodbRepo: MongodbFilmsRepository,
      ) => {
        console.log('🟢 Using MongoDB database');
        return mongodbRepo;
      },
      inject: [ConfigService, MongodbFilmsRepository],
    },
  ],
  exports: [FilmsService],
})
export class FilmsModuleMongoDB {}
