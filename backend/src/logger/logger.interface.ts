export interface LogEntry {
  level: string;
  message: any;
  context?: string;
  timestamp?: string;
  [key: string]: any;
}

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
