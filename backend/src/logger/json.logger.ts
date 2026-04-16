import { Injectable, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private context?: string;

  constructor(@Optional() context?: string) {
    this.context = context;
  }

  setContext(context: string) {
    this.context = context;
  }

  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]): string {
    const logEntry: Record<string, unknown> = {
      level,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };

    if (this.context) {
      logEntry.context = this.context;
    }

    if (optionalParams && optionalParams.length > 0) {
      logEntry.optionalParams = optionalParams.map((p) =>
        typeof p === 'string' ? p : JSON.stringify(p),
      );
    }

    return JSON.stringify(logEntry);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}