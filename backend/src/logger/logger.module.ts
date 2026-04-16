import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerFactory } from './logger.factory';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    const loggerProvider = {
      provide: 'LOGGER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return LoggerFactory.createLogger(configService);
      },
      inject: [ConfigService],
    };

    return {
      module: LoggerModule,
      providers: [
        loggerProvider,
        {
          provide: DevLogger,
          useFactory: () => new DevLogger(),
        },
        {
          provide: JsonLogger,
          useFactory: () => new JsonLogger(),
        },
        {
          provide: TskvLogger,
          useFactory: () => new TskvLogger(),
        },
      ],
      exports: ['LOGGER_SERVICE', DevLogger, JsonLogger, TskvLogger],
    };
  }
}