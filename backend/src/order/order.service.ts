import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export interface OrderResponseDto {
  total: number;
  items: Array<OrderItem & { id: string }>;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => FilmsService))
    private filmsService: FilmsService,
  ) {}

  async createOrder(orderItems: OrderItem[]): Promise<OrderResponseDto> {
    const responseItems: Array<OrderItem & { id: string }> = [];

    // Группируем по фильму и сеансу
    const groupedBySession = this.groupBySession(orderItems);

    for (const [sessionKey, items] of Object.entries(groupedBySession)) {
      const [filmId, sessionId] = sessionKey.split('|');

      // Получаем расписание
      const schedule = await this.filmsService.getFilmSchedule(
        filmId,
        sessionId,
      );

      // Проверяем соответствие дня и цены
      for (const item of items) {
        if (schedule.daytime !== item.daytime) {
          throw new BadRequestException(
            `Daytime mismatch for film ${filmId}, session ${sessionId}`,
          );
        }
        if (schedule.price !== item.price) {
          throw new BadRequestException(
            `Price mismatch for film ${filmId}, session ${sessionId}`,
          );
        }
      }

      // Проверяем места
      const seatsToBook = items.map((item) => `${item.row}:${item.seat}`);
      for (const seat of seatsToBook) {
        if (!this.isValidSeat(seat, schedule.rows, schedule.seats)) {
          throw new BadRequestException(`Invalid seat: ${seat}`);
        }
      }

      // Проверяем, что места не заняты
      const takenSet = new Set(schedule.taken);
      for (const seat of seatsToBook) {
        if (takenSet.has(seat)) {
          throw new BadRequestException(`Seat ${seat} is already taken`);
        }
      }

      // Бронируем места
      const newTaken = [...schedule.taken, ...seatsToBook];
      await this.filmsService.updateTakenSeats(filmId, sessionId, newTaken);

      // Создаем ответ
      for (const item of items) {
        responseItems.push({
          ...item,
          id: uuidv4(),
        });
      }
    }

    return {
      total: responseItems.length,
      items: responseItems,
    };
  }

  private groupBySession(items: OrderItem[]): Record<string, OrderItem[]> {
    const grouped: Record<string, OrderItem[]> = {};
    for (const item of items) {
      const key = `${item.film}|${item.session}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    }
    return grouped;
  }

  private isValidSeat(
    seat: string,
    totalRows: number,
    totalSeats: number,
  ): boolean {
    const [rowStr, seatStr] = seat.split(':');
    const row = parseInt(rowStr, 10);
    const seatNum = parseInt(seatStr, 10);
    if (isNaN(row) || isNaN(seatNum)) return false;
    if (row < 1 || row > totalRows) return false;
    if (seatNum < 1 || seatNum > totalSeats) return false;
    return true;
  }
}
