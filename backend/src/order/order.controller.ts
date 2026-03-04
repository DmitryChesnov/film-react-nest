import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResponseDto } from './dto/order.dto';

interface TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

interface CreateOrderRequestDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() orderData: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    // Валидация
    if (
      !orderData.tickets ||
      !Array.isArray(orderData.tickets) ||
      orderData.tickets.length === 0
    ) {
      throw new BadRequestException('Tickets array is required');
    }

    if (!orderData.email || !orderData.phone) {
      throw new BadRequestException('Email and phone are required');
    }

    // Преобразуем в формат, который ожидает сервис
    const orderItems = orderData.tickets.map((ticket) => ({
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
    }));

    return this.orderService.createOrder(orderItems);
  }
}
