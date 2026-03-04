import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../schemas/film.schema';
import { FilmsRepositoryInterface } from '../interfaces/films.repository.interface';
import { FilmResponseDto, ScheduleDto } from '../dto/films.dto';

@Injectable()
export class MongodbFilmsRepository implements FilmsRepositoryInterface {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<FilmResponseDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.mapToFilmDto(film));
  }

  async findById(id: string): Promise<FilmResponseDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.mapToFilmDto(film) : null;
  }

  async findSchedule(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDto | null> {
    const film = await this.filmModel
      .findOne(
        {
          id: filmId,
          'schedule.id': scheduleId,
        },
        { 'schedule.$': 1 },
      )
      .exec();

    if (!film || !film.schedule || film.schedule.length === 0) {
      return null;
    }

    const schedule = film.schedule[0];
    return this.mapToScheduleDto(schedule);
  }

  async findAllSchedules(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film || !film.schedule) {
      return [];
    }
    return film.schedule.map((schedule) => this.mapToScheduleDto(schedule));
  }

  async updateScheduleTaken(
    filmId: string,
    scheduleId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': scheduleId,
        },
        {
          $set: { 'schedule.$.taken': taken },
        },
      )
      .exec();
  }

  private mapToFilmDto(film: Film): FilmResponseDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }

  private mapToScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken || [],
    };
  }
}
