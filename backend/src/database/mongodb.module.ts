import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get('DATABASE_URL');
        console.log('🟢 Connecting to MongoDB:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}
