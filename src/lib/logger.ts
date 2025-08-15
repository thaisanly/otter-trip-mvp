import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, module: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}][${level.toUpperCase()}][${module}]`;
    
    if (data !== undefined) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  debug(module: string, message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', module, message, data));
    }
  }

  info(module: string, message: string, data?: any): void {
    console.info(this.formatMessage('info', module, message, data));
  }

  warn(module: string, message: string, data?: any): void {
    console.warn(this.formatMessage('warn', module, message, data));
  }

  error(module: string, message: string, error?: Error | any): void {
    if (error instanceof Error) {
      console.error(this.formatMessage('error', module, message), {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      });
    } else if (error) {
      console.error(this.formatMessage('error', module, message), error);
    } else {
      console.error(this.formatMessage('error', module, message));
    }
  }
}

export const logger = new Logger();

// Convenience methods for different modules
export const createLogger = (module: string) => ({
  debug: (message: string, data?: any) => logger.debug(module, message, data),
  info: (message: string, data?: any) => logger.info(module, message, data),
  warn: (message: string, data?: any) => logger.warn(module, message, data),
  error: (message: string, error?: Error | any) => logger.error(module, message, error),
});