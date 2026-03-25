import { Module, DynamicModule } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from '../films';

@Module({})
export class OrderModule {
  static register(): DynamicModule {
    return {
      module: OrderModule,
      imports: [FilmsModule.register()],
      controllers: [OrderController],
      providers: [OrderService],
      exports: [OrderService],
    };
  }
}
