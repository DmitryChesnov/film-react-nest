import { FilmResponseDto, ScheduleDto } from '../dto/films.dto';

export interface FilmsRepositoryInterface {
  findAll(): Promise<FilmResponseDto[]>;
  findById(id: string): Promise<FilmResponseDto | null>;
  findSchedule(filmId: string, scheduleId: string): Promise<ScheduleDto | null>;
  findAllSchedules(filmId: string): Promise<ScheduleDto[]>;
  updateScheduleTaken(
    filmId: string,
    scheduleId: string,
    taken: string[],
  ): Promise<void>;
}
