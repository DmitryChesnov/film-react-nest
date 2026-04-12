// backend/src/order/order.service.spec.ts (ПОЛНОСТЬЮ ЗАМЕНИТЬ)

import { Test, TestingModule } from '@nestjs/testing';
import { OrderService, OrderItem } from './order.service';
import { FilmsService } from '../films/films.service';
import { BadRequestException } from '@nestjs/common';

// Мокаем uuid, чтобы избежать проблем с ES Modules
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-id'),
}));

describe('OrderService', () => {
  let service: OrderService;
  let mockFilmsService: any;
  let mockLogger: any;

  const mockSchedule = {
    id: 'session-1',
    daytime: '2024-06-28T10:00:53+03:00',
    hall: '1',
    rows: 5,
    seats: 10,
    price: 350,
    taken: [],
  };

  const validOrderItems: OrderItem[] = [
    {
      film: 'film-1',
      session: 'session-1',
      daytime: '2024-06-28T10:00:53+03:00',
      row: 1,
      seat: 5,
      price: 350,
    },
  ];

  beforeEach(async () => {
    mockFilmsService = {
      getFilmSchedule: jest.fn(),
      updateTakenSeats: jest.fn(),
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
        OrderService,
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
        {
          provide: 'LOGGER_SERVICE',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSchedule);
      mockFilmsService.updateTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(validOrderItems);

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toHaveProperty('id', 'mocked-uuid-id');
      expect(result.items[0].row).toBe(1);
      expect(result.items[0].seat).toBe(5);
      expect(mockFilmsService.updateTakenSeats).toHaveBeenCalledWith(
        'film-1',
        'session-1',
        ['1:5'],
      );
    });

    it('should throw error when daytime mismatch', async () => {
      const wrongDaytimeSchedule = {
        ...mockSchedule,
        daytime: '2024-06-28T14:00:00+03:00',
      };
      mockFilmsService.getFilmSchedule.mockResolvedValue(wrongDaytimeSchedule);

      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        'Daytime mismatch',
      );
    });

    it('should throw error when price mismatch', async () => {
      const wrongPriceSchedule = { ...mockSchedule, price: 400 };
      mockFilmsService.getFilmSchedule.mockResolvedValue(wrongPriceSchedule);

      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        'Price mismatch',
      );
    });

    it('should throw error when seat is already taken', async () => {
      const takenSchedule = { ...mockSchedule, taken: ['1:5'] };
      mockFilmsService.getFilmSchedule.mockResolvedValue(takenSchedule);

      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(validOrderItems)).rejects.toThrow(
        'Seat 1:5 is already taken',
      );
    });

    it('should throw error when seat is invalid (row out of range)', async () => {
      const invalidSeatItems = [
        {
          ...validOrderItems[0],
          row: 10, // row больше чем rows=5
        },
      ];
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSchedule);

      await expect(service.createOrder(invalidSeatItems)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(invalidSeatItems)).rejects.toThrow(
        'Invalid seat',
      );
    });

    it('should throw error when seat is invalid (seat out of range)', async () => {
      const invalidSeatItems = [
        {
          ...validOrderItems[0],
          seat: 20, // seat больше чем seats=10
        },
      ];
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSchedule);

      await expect(service.createOrder(invalidSeatItems)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createOrder(invalidSeatItems)).rejects.toThrow(
        'Invalid seat',
      );
    });

    it('should handle multiple tickets for same session', async () => {
      const multipleTickets = [
        validOrderItems[0],
        {
          ...validOrderItems[0],
          row: 2,
          seat: 3,
        },
      ];
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSchedule);
      mockFilmsService.updateTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(multipleTickets);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(mockFilmsService.updateTakenSeats).toHaveBeenCalledWith(
        'film-1',
        'session-1',
        ['1:5', '2:3'],
      );
    });

    it('should handle tickets for different sessions', async () => {
      const differentSessions = [
        validOrderItems[0],
        {
          ...validOrderItems[0],
          session: 'session-2',
          daytime: '2024-06-28T14:00:00+03:00',
          row: 2,
          seat: 3,
        },
      ];

      const schedule2 = {
        ...mockSchedule,
        id: 'session-2',
        daytime: '2024-06-28T14:00:00+03:00',
      };

      mockFilmsService.getFilmSchedule
        .mockResolvedValueOnce(mockSchedule)
        .mockResolvedValueOnce(schedule2);
      mockFilmsService.updateTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(differentSessions);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(mockFilmsService.updateTakenSeats).toHaveBeenCalledTimes(2);
    });
  });
});
