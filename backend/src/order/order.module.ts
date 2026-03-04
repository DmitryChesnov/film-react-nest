import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [
    forwardRef(() => FilmsModule), // Используем forwardRef для разрешения циклической зависимости
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
