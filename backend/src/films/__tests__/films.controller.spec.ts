import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    getAllFilms: jest.fn(),
    getFilmById: jest.fn(),
    getFilmSchedules: jest.fn(),
  };

  const mockFilm = {
    id: 'test-id',
    title: 'Test Film',
    rating: 8.5,
    director: 'Test Director',
    tags: ['Action'],
    image: '/test.jpg',
    cover: '/test-cover.jpg',
    about: 'Test about',
    description: 'Test description',
  };

  const mockSchedules = [
    {
      id: 'schedule-1',
      daytime: '2024-06-28T10:00:53+03:00',
      hall: 0,
      rows: 5,
      seats: 10,
      price: 350,
      taken: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFilms', () => {
    it('should return formatted response with total and items', async () => {
      mockFilmsService.getAllFilms.mockResolvedValue([mockFilm]);

      const result = await controller.getAllFilms();

      expect(result).toEqual({
        total: 1,
        items: [mockFilm],
      });
      expect(mockFilmsService.getAllFilms).toHaveBeenCalled();
    });

    it('should return empty array when no films', async () => {
      mockFilmsService.getAllFilms.mockResolvedValue([]);

      const result = await controller.getAllFilms();

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('getFilmById', () => {
    it('should return film when found', async () => {
      mockFilmsService.getFilmById.mockResolvedValue(mockFilm);

      const result = await controller.getFilmById('test-id');

      expect(result).toEqual(mockFilm);
      expect(mockFilmsService.getFilmById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when film not found', async () => {
      mockFilmsService.getFilmById.mockRejectedValue(
        new NotFoundException('Film not found'),
      );

      await expect(controller.getFilmById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFilmSchedule', () => {
    it('should return formatted schedule response', async () => {
      mockFilmsService.getFilmSchedules.mockResolvedValue(mockSchedules);

      const result = await controller.getFilmSchedule('test-id');

      expect(result).toEqual({
        total: 1,
        items: mockSchedules,
      });
      expect(mockFilmsService.getFilmSchedules).toHaveBeenCalledWith('test-id');
    });

    it('should return empty schedule when no schedules', async () => {
      mockFilmsService.getFilmSchedules.mockResolvedValue([]);

      const result = await controller.getFilmSchedule('test-id');

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });
});
