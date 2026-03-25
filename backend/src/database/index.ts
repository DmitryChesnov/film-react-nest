import { DynamicModule, Module } from '@nestjs/common';
import { MongoDBModule } from './mongodb.module';
import { PostgresModule } from './postgres.module';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const driver = process.env.DATABASE_DRIVER || 'mongodb';

    if (driver === 'postgres') {
      console.log('🔵 PostgreSQL module loaded');
      return {
        module: DatabaseModule,
        imports: [PostgresModule],
      };
    } else {
      console.log('🟢 MongoDB module loaded');
      return {
        module: DatabaseModule,
        imports: [MongoDBModule],
      };
    }
  }
}
