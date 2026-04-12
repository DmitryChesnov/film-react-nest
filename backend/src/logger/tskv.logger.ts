import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  setContext(context: string) {
    this.context = context;
  }

  /**
   * Экранирует специальные символы для TSKV формата
   * Заменяет \n, \r, \t на пробелы, так как они используются как разделители
   */
  private escapeTskv(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    let str = typeof value === 'string' ? value : JSON.stringify(value);

    // Заменяем управляющие символы на пробелы
    str = str.replace(/[\n\r\t]/g, ' ');
    // Удаляем лишние пробелы
    str = str.replace(/\s+/g, ' ').trim();

    return str;
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    const fields: string[] = [];

    // Обязательные поля
    fields.push(`level=${this.escapeTskv(level)}`);
    fields.push(`timestamp=${this.escapeTskv(new Date().toISOString())}`);
    fields.push(`message=${this.escapeTskv(message)}`);

    // Контекст если есть
    if (this.context) {
      fields.push(`context=${this.escapeTskv(this.context)}`);
    }

    // Дополнительные параметры
    if (optionalParams && optionalParams.length > 0) {
      const formattedParams = optionalParams
        .map((p) => (typeof p === 'string' ? p : JSON.stringify(p)))
        .join(', ');
      fields.push(`params=${this.escapeTskv(formattedParams)}`);
    }

    // Разделяем табуляцией
    return fields.join('\t');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
