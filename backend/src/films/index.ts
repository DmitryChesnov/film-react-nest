import { Type } from '@nestjs/common';
import { FilmsModulePostgres } from './films.module.postgres';
import { FilmsModuleMongoDB } from './films.module.mongodb';

export class FilmsModule {
  static register(): Type<any> {
    const driver = process.env.DATABASE_DRIVER || 'mongodb';

    if (driver === 'postgres') {
      return FilmsModulePostgres;
    } else {
      return FilmsModuleMongoDB;
    }
  }
}
