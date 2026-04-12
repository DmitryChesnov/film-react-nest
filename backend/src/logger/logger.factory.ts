import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LoggerType = 'dev' | 'json' | 'tskv';

export class LoggerFactory {
  static createLogger(configService?: ConfigService): LoggerService {
    let loggerType: LoggerType = 'dev';

    if (configService) {
      const envType = configService
        .get<string>('LOG_FORMAT', 'dev')
        .toLowerCase();
      if (envType === 'json') {
        loggerType = 'json';
      } else if (envType === 'tskv') {
        loggerType = 'tskv';
      }
    } else {
      // Fallback к переменной окружения если ConfigService не передан
      const envType = process.env.LOG_FORMAT || 'dev';
      if (envType === 'json') {
        loggerType = 'json';
      } else if (envType === 'tskv') {
        loggerType = 'tskv';
      }
    }

    console.log(`📝 Initializing logger: ${loggerType}`);

    switch (loggerType) {
      case 'json':
        return new JsonLogger();
      case 'tskv':
        return new TskvLogger();
      default:
        return new DevLogger();
    }
  }

  static getLoggerType(): LoggerType {
    const type = process.env.LOG_FORMAT || 'dev';
    if (type === 'json') return 'json';
    if (type === 'tskv') return 'tskv';
    return 'dev';
  }
}
