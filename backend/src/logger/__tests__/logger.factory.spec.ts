import { LoggerFactory } from '../logger.factory';
import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('LoggerFactory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('createLogger', () => {
    it('should return DevLogger when LOG_FORMAT is dev', () => {
      process.env.LOG_FORMAT = 'dev';
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should return JsonLogger when LOG_FORMAT is json', () => {
      process.env.LOG_FORMAT = 'json';
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(JsonLogger);
    });

    it('should return TskvLogger when LOG_FORMAT is tskv', () => {
      process.env.LOG_FORMAT = 'tskv';
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(TskvLogger);
    });

    it('should default to DevLogger when LOG_FORMAT is not set', () => {
      delete process.env.LOG_FORMAT;
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should default to DevLogger when LOG_FORMAT is invalid', () => {
      process.env.LOG_FORMAT = 'invalid';
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(DevLogger);
    });
  });

  describe('getLoggerType', () => {
    it('should return dev by default', () => {
      delete process.env.LOG_FORMAT;
      expect(LoggerFactory.getLoggerType()).toBe('dev');
    });

    it('should return json when set', () => {
      process.env.LOG_FORMAT = 'json';
      expect(LoggerFactory.getLoggerType()).toBe('json');
    });

    it('should return tskv when set', () => {
      process.env.LOG_FORMAT = 'tskv';
      expect(LoggerFactory.getLoggerType()).toBe('tskv');
    });
  });
});
