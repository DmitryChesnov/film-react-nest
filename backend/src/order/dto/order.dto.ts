//TODO реализовать DTO для /orders
// DTO для одного билета в заказе
export class OrderItemDto {
  film: string; // ID фильма
  session: string; // ID сеанса (в коллекции session, не schedule)
  daytime: string; // время сеанса
  row: number; // ряд
  seat: number; // место
  price: number; // цена
}

// DTO для создания заказа (принимает массив)
export class CreateOrderDto extends Array<OrderItemDto> {}

// DTO для одного билета в ответе
export class OrderResponseItemDto extends OrderItemDto {
  id: string; // уникальный ID билета/заказа
}

// DTO для ответа на создание заказа
export class OrderResponseDto {
  total: number; // количество билетов
  items: OrderResponseItemDto[]; // массив забронированных билетов
}
