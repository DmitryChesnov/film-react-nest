import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsService', () => {
  let service: FilmsService;
  let mockRepository: any;
  let mockLogger: any;

  const mockFilm = {
    id: '1',
    title: 'Test Film',
    rating: 8.5,
    director: 'Test Director',
    tags: ['Action'],
    image: '/test.jpg',
    cover: '/test-cover.jpg',
    about: 'Test about',
    description: 'Test description',
  };

  const mockSchedule = {
    id: 's1',
    daytime: '2024-06-28T10:00:53+03:00',
    hall: '1',
    rows: 5,
    seats: 10,
    price: 350,
    taken: [],
  };

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findSchedule: jest.fn(),
      findAllSchedules: jest.fn(),
      updateScheduleTaken: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'FILMS_REPOSITORY',
          useValue: mockRepository,
        },
        {
          provide: 'LOGGER_SERVICE',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('should return all films', async () => {
      mockRepository.findAll.mockResolvedValue([mockFilm]);

      const result = await service.getAllFilms();

      expect(result).toEqual([mockFilm]);
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockLogger.log).toHaveBeenCalledWith('Getting all films');
    });

    it('should return empty array when no films', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllFilms();

      expect(result).toEqual([]);
      expect(mockLogger.debug).toHaveBeenCalledWith('Found 0 films');
    });
  });

  describe('getFilmById', () => {
    it('should return film when found', async () => {
      mockRepository.findById.mockResolvedValue(mockFilm);

      const result = await service.getFilmById('1');

      expect(result).toEqual(mockFilm);
      expect(mockLogger.log).toHaveBeenCalledWith('Getting film by id: 1');
    });

    it('should throw NotFoundException when film not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getFilmById('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Film with id 999 not found',
      );
    });
  });

  describe('getFilmSchedules', () => {
    it('should return schedules for film', async () => {
      mockRepository.findById.mockResolvedValue(mockFilm);
      mockRepository.findAllSchedules.mockResolvedValue([mockSchedule]);

      const result = await service.getFilmSchedules('1');

      expect(result).toEqual([mockSchedule]);
      expect(mockRepository.findAllSchedules).toHaveBeenCalledWith('1');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Found 1 schedules for film 1',
      );
    });

    it('should throw NotFoundException when film not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getFilmSchedules('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFilmSchedule', () => {
    it('should return specific schedule', async () => {
      mockRepository.findSchedule.mockResolvedValue(mockSchedule);

      const result = await service.getFilmSchedule('1', 's1');

      expect(result).toEqual(mockSchedule);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Getting schedule s1 for film 1',
      );
    });

    it('should throw NotFoundException when schedule not found', async () => {
      mockRepository.findSchedule.mockResolvedValue(null);

      await expect(service.getFilmSchedule('1', 's999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Schedule s999 for film 1 not found',
      );
    });
  });

  describe('updateTakenSeats', () => {
    it('should update taken seats', async () => {
      const taken = ['1:5', '2:3'];
      mockRepository.updateScheduleTaken.mockResolvedValue(undefined);

      await service.updateTakenSeats('1', 's1', taken);

      expect(mockRepository.updateScheduleTaken).toHaveBeenCalledWith(
        '1',
        's1',
        taken,
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Updating taken seats for schedule s1 of film 1',
      );
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Seats to update: 1:5, 2:3',
      );
    });
  });
});
