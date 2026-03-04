import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FilmsRepositoryInterface } from './interfaces/films.repository.interface';
import { FilmResponseDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private filmsRepository: FilmsRepositoryInterface,
  ) {}

  async getAllFilms(): Promise<FilmResponseDto[]> {
    return this.filmsRepository.findAll();
  }

  async getFilmById(id: string): Promise<FilmResponseDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return film;
  }

  async getFilmSchedules(filmId: string): Promise<ScheduleDto[]> {
    // Проверяем, что фильм существует (метод сам кинет NotFoundException если нет)
    await this.getFilmById(filmId);
    return this.filmsRepository.findAllSchedules(filmId);
  }

  async getFilmSchedule(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDto> {
    const schedule = await this.filmsRepository.findSchedule(
      filmId,
      scheduleId,
    );
    if (!schedule) {
      throw new NotFoundException(
        `Schedule with id ${scheduleId} for film ${filmId} not found`,
      );
    }
    return schedule;
  }

  async updateTakenSeats(
    filmId: string,
    scheduleId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmsRepository.updateScheduleTaken(filmId, scheduleId, taken);
  }
}
