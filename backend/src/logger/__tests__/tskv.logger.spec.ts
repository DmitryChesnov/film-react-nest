import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatMessage', () => {
    it('should format log message as TSKV', () => {
      const result = logger.formatMessage('log', 'Test message');

      expect(result).toContain('level=log');
      expect(result).toContain('message=Test message');
      expect(result).toContain('timestamp=');
      // TSKV формат: поля разделены табуляцией
      expect(result.split('\t').length).toBeGreaterThanOrEqual(3);
    });

    it('should escape special characters', () => {
      const result = logger.formatMessage(
        'log',
        'Message\nwith\ttabs and\nnewlines',
      );

      // Проверяем, что управляющие символы заменены на пробелы
      expect(result).toContain('message=Message with tabs and newlines');
      // Проверяем, что нет символов новой строки
      expect(result.includes('\n')).toBe(false);
      // В TSKV табуляция используется как разделитель полей, поэтому она ДОЛЖНА быть
      // Проверяем, что в значении message нет множественных пробелов
      expect(result).toMatch(/message=[^\t]+/);
    });

    it('should include context when set', () => {
      logger.setContext('TestContext');
      const result = logger.formatMessage('log', 'Test message');

      expect(result).toContain('context=TestContext');
      expect(result.split('\t').length).toBeGreaterThanOrEqual(4);
    });

    it('should handle object messages', () => {
      const objMessage = { key: 'value', nested: { foo: 'bar' } };
      const result = logger.formatMessage('log', objMessage);

      expect(result).toContain('message=' + JSON.stringify(objMessage));
    });

    it('should include optional parameters', () => {
      const result = logger.formatMessage('log', 'Test', 'param1', 'param2');

      expect(result).toContain('params=param1, param2');
    });

    it('should handle null and undefined values', () => {
      const resultNull = logger.formatMessage('log', null);
      const resultUndefined = logger.formatMessage('log', undefined);

      expect(resultNull).toContain('message=');
      expect(resultUndefined).toContain('message=');
    });

    it('should handle multiple optional parameters of different types', () => {
      const result = logger.formatMessage('log', 'Test', 123, { foo: 'bar' }, [
        'a',
        'b',
      ]);

      expect(result).toContain('params=123, {"foo":"bar"}, ["a","b"]');
    });

    it('should escape special characters in optional parameters', () => {
      const result = logger.formatMessage(
        'log',
        'Test',
        'param\nwith\tnewlines',
      );

      expect(result).toContain('params=param with newlines');
      expect(result.includes('\n')).toBe(false);
    });
  });

  describe('log methods', () => {
    it('should call console.log with formatted message for log method', () => {
      logger.log('Test log');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledArg = consoleLogSpy.mock.calls[0][0];
      expect(calledArg).toContain('level=log');
      expect(calledArg).toContain('message=Test log');
    });

    it('should call console.error for error method', () => {
      logger.error('Test error');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const calledArg = consoleErrorSpy.mock.calls[0][0];
      expect(calledArg).toContain('level=error');
      expect(calledArg).toContain('message=Test error');
    });

    it('should call console.warn for warn method', () => {
      logger.warn('Test warn');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const calledArg = consoleWarnSpy.mock.calls[0][0];
      expect(calledArg).toContain('level=warn');
      expect(calledArg).toContain('message=Test warn');
    });

    it('should call console.debug for debug method', () => {
      logger.debug('Test debug');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const calledArg = consoleDebugSpy.mock.calls[0][0];
      expect(calledArg).toContain('level=debug');
      expect(calledArg).toContain('message=Test debug');
    });

    it('should call console.log for verbose method', () => {
      logger.verbose('Test verbose');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const calledArg = consoleLogSpy.mock.calls[0][0];
      expect(calledArg).toContain('level=verbose');
      expect(calledArg).toContain('message=Test verbose');
    });

    it('should pass optional parameters to formatted message', () => {
      logger.log('Test message', 'param1', 'param2');

      const calledArg = consoleLogSpy.mock.calls[0][0];
      expect(calledArg).toContain('params=param1, param2');
    });
  });

  describe('setContext', () => {
    it('should update context for subsequent log messages', () => {
      logger.setContext('FirstContext');
      let result = logger.formatMessage('log', 'Message 1');
      expect(result).toContain('context=FirstContext');

      logger.setContext('SecondContext');
      result = logger.formatMessage('log', 'Message 2');
      expect(result).toContain('context=SecondContext');
    });
  });

  describe('TSKV format compliance', () => {
    it('should use tab as field separator', () => {
      const result = logger.formatMessage('log', 'Test');

      // Проверяем, что поля разделены табуляцией
      const fields = result.split('\t');
      expect(fields.length).toBeGreaterThanOrEqual(3);

      // Проверяем формат каждого поля: key=value
      fields.forEach((field) => {
        expect(field).toMatch(/^[a-z]+=.+/);
      });
    });

    it('should not contain newlines in output', () => {
      const result = logger.formatMessage('log', 'Message\nwith\nnewlines');

      expect(result.includes('\n')).toBe(false);
    });

    it('should handle error objects', () => {
      const error = new Error('Test error');
      const result = logger.formatMessage('error', error.message, error.stack);

      expect(result).toContain('level=error');
      expect(result).toContain('message=Test error');
    });
  });
});
