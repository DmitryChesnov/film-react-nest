import { Module } from '@nestjs/common'; // Убрали forwardRef - он не нужен здесь
import { MongooseModule } from '@nestjs/mongoose';
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
    {
      provide: 'FILMS_REPOSITORY',
      useClass: MongodbFilmsRepository,
    },
  ],
  exports: [FilmsService],
})
export class FilmsModule {}
