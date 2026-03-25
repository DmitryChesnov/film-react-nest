import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../../entities/film.entity';
import { Schedule } from '../../entities/schedule.entity';
import { FilmsRepositoryInterface } from '../interfaces/films.repository.interface';
import { FilmResponseDto, ScheduleDto } from '../dto/films.dto';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepositoryInterface {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmResponseDto[]> {
    const films = await this.filmRepository.find();
    return films.map((film) => this.mapToFilmDto(film));
  }

  async findById(id: string): Promise<FilmResponseDto | null> {
    const film = await this.filmRepository.findOne({ where: { id } });
    return film ? this.mapToFilmDto(film) : null;
  }

  async findSchedule(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId, film_id: filmId },
    });
    return schedule ? this.mapToScheduleDto(schedule) : null;
  }

  async findAllSchedules(filmId: string): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { film_id: filmId },
    });
    return schedules.map((schedule) => this.mapToScheduleDto(schedule));
  }

  async updateScheduleTaken(
    filmId: string,
    scheduleId: string,
    taken: string[],
  ): Promise<void> {
    await this.scheduleRepository.update(
      { id: scheduleId, film_id: filmId },
      { taken },
    );
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

  private mapToScheduleDto(schedule: Schedule): ScheduleDto {
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
