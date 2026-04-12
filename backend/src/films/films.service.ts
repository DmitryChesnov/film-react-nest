import {
  Injectable,
  Inject,
  NotFoundException,
  LoggerService,
} from '@nestjs/common';
import { FilmsRepositoryInterface } from './interfaces/films.repository.interface';
import { FilmResponseDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private filmsRepository: FilmsRepositoryInterface,
    @Inject('LOGGER_SERVICE')
    private logger: LoggerService,
  ) {}

  async getAllFilms(): Promise<FilmResponseDto[]> {
    this.logger.log('Getting all films');
    const films = await this.filmsRepository.findAll();
    this.logger.debug(`Found ${films.length} films`);
    return films;
  }

  async getFilmById(id: string): Promise<FilmResponseDto> {
    this.logger.log(`Getting film by id: ${id}`);
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      this.logger.warn(`Film with id ${id} not found`);
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return film;
  }

  async getFilmSchedules(filmId: string): Promise<ScheduleDto[]> {
    this.logger.log(`Getting schedules for film: ${filmId}`);
    await this.getFilmById(filmId);
    const schedules = await this.filmsRepository.findAllSchedules(filmId);
    this.logger.debug(`Found ${schedules.length} schedules for film ${filmId}`);
    return schedules;
  }

  async getFilmSchedule(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleDto> {
    this.logger.log(`Getting schedule ${scheduleId} for film ${filmId}`);
    const schedule = await this.filmsRepository.findSchedule(
      filmId,
      scheduleId,
    );
    if (!schedule) {
      this.logger.warn(`Schedule ${scheduleId} for film ${filmId} not found`);
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
    this.logger.log(
      `Updating taken seats for schedule ${scheduleId} of film ${filmId}`,
    );
    this.logger.debug(`Seats to update: ${taken.join(', ')}`);
    await this.filmsRepository.updateScheduleTaken(filmId, scheduleId, taken);
    this.logger.log(`Successfully updated taken seats`);
  }
}
