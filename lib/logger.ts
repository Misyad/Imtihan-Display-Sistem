type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LOG_LEVEL: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = CURRENT_LOG_LEVEL) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.level];
  }

  private print(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toLocaleTimeString();
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
      const args: any[] = [`[${level.toUpperCase()}] ${timestamp} - ${message}`];
      if (context) args.push(context);
      
      switch (level) {
        case 'debug':
          console.debug(...args);
          break;
        case 'info':
          console.info(...args);
          break;
        case 'warn':
          console.warn(...args);
          break;
        case 'error':
          console.error(...args);
          break;
      }
    } else {
      // Server-side (Node.js) with ANSI color codes
      const reset = '\x1b[0m';
      const gray = '\x1b[90m';
      let color = '';
      
      switch (level) {
        case 'debug':
          color = '\x1b[36m'; // Cyan
          break;
        case 'info':
          color = '\x1b[32m'; // Green
          break;
        case 'warn':
          color = '\x1b[33m'; // Yellow
          break;
        case 'error':
          color = '\x1b[31m'; // Red
          break;
      }

      const prefix = `${color}[${level.toUpperCase()}]${reset} ${gray}${timestamp}${reset}`;
      if (context) {
        console.log(`${prefix} - ${message}`, JSON.stringify(context, null, 2));
      } else {
        console.log(`${prefix} - ${message}`);
      }
    }
  }

  public debug(message: string, context?: LogContext) {
    this.print('debug', message, context);
  }

  public info(message: string, context?: LogContext) {
    this.print('info', message, context);
  }

  public warn(message: string, context?: LogContext) {
    this.print('warn', message, context);
  }

  public error(message: string, context?: LogContext, error?: any) {
    const errorContext = error
      ? {
          ...context,
          error: {
            name: error.name || 'Error',
            message: error.message || String(error),
            stack: error.stack,
          },
        }
      : context;
    this.print('error', message, errorContext);
  }
}

export const logger = new Logger();
