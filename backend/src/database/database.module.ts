import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBModule } from './mongodb.module';
import { PostgresModule } from './postgres.module';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        {
          module: class DynamicModule {},
          imports: [],
          providers: [],
          exports: [],
        },
      ],
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        {
          module: class DynamicModule {},
          imports: [],
          providers: [
            {
              provide: 'DATABASE_MODULE',
              useFactory: (configService: ConfigService) => {
                const driver = configService.get('DATABASE_DRIVER', 'mongodb');
                console.log(`📀 Database driver: ${driver}`);

                if (driver === 'postgres') {
                  console.log('🔵 Using PostgreSQL database');
                  return PostgresModule;
                } else {
                  console.log('🟢 Using MongoDB database');
                  return MongoDBModule;
                }
              },
              inject: [ConfigService],
            },
          ],
          exports: [],
        },
      ],
    };
  }
}
