// Mock env before imports
jest.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development'
  }
}));

describe('logger', () => {
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('logger instance', () => {
    it('should log debug messages in development', async () => {
      const { logger } = await import('@/lib/logger');

      logger.debug('TestModule', 'Debug message');

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[DEBUG]');
      expect(loggedMessage).toContain('[TestModule]');
      expect(loggedMessage).toContain('Debug message');
    });

    it('should log debug messages with data', async () => {
      const { logger } = await import('@/lib/logger');

      logger.debug('TestModule', 'Debug with data', { key: 'value' });

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('"key": "value"');
    });

    it('should log info messages', async () => {
      const { logger } = await import('@/lib/logger');

      logger.info('TestModule', 'Info message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[INFO]');
      expect(loggedMessage).toContain('[TestModule]');
      expect(loggedMessage).toContain('Info message');
    });

    it('should log info messages with data', async () => {
      const { logger } = await import('@/lib/logger');

      logger.info('TestModule', 'Info with data', { count: 42 });

      expect(consoleInfoSpy).toHaveBeenCalled();
      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('"count": 42');
    });

    it('should log warn messages', async () => {
      const { logger } = await import('@/lib/logger');

      logger.warn('TestModule', 'Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedMessage = consoleWarnSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[WARN]');
      expect(loggedMessage).toContain('[TestModule]');
      expect(loggedMessage).toContain('Warning message');
    });

    it('should log warn messages with data', async () => {
      const { logger } = await import('@/lib/logger');

      logger.warn('TestModule', 'Warning with data', { warning: 'test' });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedMessage = consoleWarnSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('"warning": "test"');
    });

    it('should log error messages', async () => {
      const { logger } = await import('@/lib/logger');

      logger.error('TestModule', 'Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR]');
      expect(loggedMessage).toContain('[TestModule]');
      expect(loggedMessage).toContain('Error message');
    });

    it('should log error messages with Error object', async () => {
      const { logger } = await import('@/lib/logger');

      const testError = new Error('Test error');
      logger.error('TestModule', 'Error with exception', testError);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR]');
      expect(loggedMessage).toContain('Error with exception');

      const errorData = consoleErrorSpy.mock.calls[0][1];
      expect(errorData.name).toBe('Error');
      expect(errorData.message).toBe('Test error');
    });

    it('should log error messages with non-Error object', async () => {
      const { logger } = await import('@/lib/logger');

      logger.error('TestModule', 'Error with object', { code: 500 });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorData = consoleErrorSpy.mock.calls[0][1];
      expect(errorData).toEqual({ code: 500 });
    });

    it('should include timestamp in log messages', async () => {
      const { logger } = await import('@/lib/logger');

      logger.info('TestModule', 'Test message');

      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      // Check for ISO timestamp format
      expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('createLogger', () => {
    it('should create a logger with a fixed module name', async () => {
      const { createLogger } = await import('@/lib/logger');

      const moduleLogger = createLogger('MyModule');

      moduleLogger.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[MyModule]');
    });

    it('should support all log levels', async () => {
      const { createLogger } = await import('@/lib/logger');

      const moduleLogger = createLogger('TestModule');

      moduleLogger.debug('Debug');
      moduleLogger.info('Info');
      moduleLogger.warn('Warn');
      moduleLogger.error('Error');

      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should pass data to underlying logger methods', async () => {
      const { createLogger } = await import('@/lib/logger');

      const moduleLogger = createLogger('TestModule');

      moduleLogger.info('Info with data', { test: true });

      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('"test": true');
    });

    it('should pass error to underlying logger error method', async () => {
      const { createLogger } = await import('@/lib/logger');

      const moduleLogger = createLogger('TestModule');
      const error = new Error('Module error');

      moduleLogger.error('Error occurred', error);

      const errorData = consoleErrorSpy.mock.calls[0][1];
      expect(errorData.message).toBe('Module error');
    });
  });

  describe('production mode', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('@/lib/env', () => ({
        env: {
          NODE_ENV: 'production'
        }
      }));
    });

    afterEach(() => {
      jest.dontMock('@/lib/env');
    });

    it('should not log debug messages in production', async () => {
      const { logger } = await import('@/lib/logger');

      logger.debug('TestModule', 'Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should still log info, warn, and error in production', async () => {
      const { logger } = await import('@/lib/logger');

      logger.info('TestModule', 'Info message');
      logger.warn('TestModule', 'Warn message');
      logger.error('TestModule', 'Error message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not include stack trace in error logs in production', async () => {
      const { logger } = await import('@/lib/logger');

      const error = new Error('Production error');
      logger.error('TestModule', 'Error', error);

      const errorData = consoleErrorSpy.mock.calls[0][1];
      expect(errorData.stack).toBeUndefined();
    });
  });
});
