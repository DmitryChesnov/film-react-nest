import { Injectable, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class DevLogger implements LoggerService {
  private context?: string;

  constructor(@Optional() context?: string) {
    this.context = context;
  }

  setContext(context: string) {
    this.context = context;
  }

  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]): string {
    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}] ` : '';
    const paramsStr = optionalParams.length ? ` ${optionalParams.map(p => 
      typeof p === 'string' ? p : JSON.stringify(p)
    ).join(' ')}` : '';
    
    return `${timestamp} ${level.toUpperCase()} ${contextStr}${message}${paramsStr}`;
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