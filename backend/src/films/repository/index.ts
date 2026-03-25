import { ConfigService } from '@nestjs/config';
import { FilmsRepositoryInterface } from '../interfaces/films.repository.interface';
import { MongodbFilmsRepository } from './mongodb.films.repository';
import { PostgresFilmsRepository } from './postgres.films.repository';

// Простая функция для выбора репозитория
export function getFilmsRepository(
  configService: ConfigService,
  mongodbRepo: MongodbFilmsRepository,
  postgresRepo: PostgresFilmsRepository,
): FilmsRepositoryInterface {
  const driver = configService.get('DATABASE_DRIVER', 'mongodb');

  if (driver === 'postgres') {
    console.log('🔵 Using PostgreSQL database');
    return postgresRepo;
  }

  console.log('🟢 Using MongoDB database');
  return mongodbRepo;
}
