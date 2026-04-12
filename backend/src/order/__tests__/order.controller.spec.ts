import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  const validOrderRequest = {
    email: 'test@example.com',
    phone: '+1234567890',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 5,
        price: 350,
      },
    ],
  };

  const mockOrderResponse = {
    total: 1,
    items: [
      {
        id: 'order-id-1',
        ...validOrderRequest.tickets[0],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      const result = await controller.createOrder(validOrderRequest);

      expect(result).toEqual(mockOrderResponse);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(
        validOrderRequest.tickets,
      );
    });

    it('should throw BadRequestException when tickets array is missing', async () => {
      const invalidRequest = {
        email: 'test@example.com',
        phone: '+1234567890',
      };

      await expect(
        controller.createOrder(invalidRequest as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when tickets array is empty', async () => {
      const invalidRequest = {
        email: 'test@example.com',
        phone: '+1234567890',
        tickets: [],
      };

      await expect(controller.createOrder(invalidRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when email is missing', async () => {
      const invalidRequest = {
        phone: '+1234567890',
        tickets: validOrderRequest.tickets,
      };

      await expect(
        controller.createOrder(invalidRequest as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when phone is missing', async () => {
      const invalidRequest = {
        email: 'test@example.com',
        tickets: validOrderRequest.tickets,
      };

      await expect(
        controller.createOrder(invalidRequest as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
