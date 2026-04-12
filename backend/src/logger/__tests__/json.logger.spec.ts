import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatMessage', () => {
    it('should format log message as JSON', () => {
      const result = logger.formatMessage('log', 'Test message');
      const parsed = JSON.parse(result);

      expect(parsed).toHaveProperty('level', 'log');
      expect(parsed).toHaveProperty('message', 'Test message');
      expect(parsed).toHaveProperty('timestamp');
    });

    it('should include context when set', () => {
      logger.setContext('TestContext');
      const result = logger.formatMessage('log', 'Test message');
      const parsed = JSON.parse(result);

      expect(parsed).toHaveProperty('context', 'TestContext');
    });

    it('should handle object messages', () => {
      const objMessage = { key: 'value', nested: { foo: 'bar' } };
      const result = logger.formatMessage('log', objMessage);
      const parsed = JSON.parse(result);

      expect(parsed.message).toBe(JSON.stringify(objMessage));
    });

    it('should include optional parameters', () => {
      const result = logger.formatMessage('log', 'Test', 'param1', 'param2');
      const parsed = JSON.parse(result);

      expect(parsed.optionalParams).toEqual(['param1', 'param2']);
    });
  });

  describe('log methods', () => {
    it('should call console.log for log method', () => {
      logger.log('Test log');
      expect(consoleLogSpy).toHaveBeenCalled();
      const calledArg = consoleLogSpy.mock.calls[0][0];
      expect(JSON.parse(calledArg).level).toBe('log');
    });

    it('should call console.error for error method', () => {
      logger.error('Test error');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const calledArg = consoleErrorSpy.mock.calls[0][0];
      expect(JSON.parse(calledArg).level).toBe('error');
    });

    it('should call console.warn for warn method', () => {
      logger.warn('Test warn');
      expect(consoleWarnSpy).toHaveBeenCalled();
      const calledArg = consoleWarnSpy.mock.calls[0][0];
      expect(JSON.parse(calledArg).level).toBe('warn');
    });
  });
});
