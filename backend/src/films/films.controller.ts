import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import {
  FilmsListResponseDto,
  ScheduleListResponseDto,
  FilmResponseDto,
} from './dto/films.dto';

@Controller('films') // Без префикса api/afisha, так как он в main.ts
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<FilmsListResponseDto> {
    const films = await this.filmsService.getAllFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  @Get(':id')
  async getFilmById(@Param('id') id: string): Promise<FilmResponseDto> {
    return this.filmsService.getFilmById(id);
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ScheduleListResponseDto> {
    const schedules = await this.filmsService.getFilmSchedules(id);
    return {
      total: schedules.length,
      items: schedules,
    };
  }
}
