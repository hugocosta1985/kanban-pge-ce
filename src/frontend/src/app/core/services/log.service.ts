import { Injectable } from '@angular/core';

export interface LogEntry {
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: Date;
  context?: any;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  log(
    message: string,
    level: 'INFO' | 'WARN' | 'ERROR' = 'INFO',
    context?: any
  ) {
    const entry: LogEntry = {
      message,
      level,
      timestamp: new Date(),
      context,
    };
  }

  error(message: string, error: any) {
    this.log(message, 'ERROR', error);
  }

  info(message: string) {
    this.log(message, 'INFO');
  }
}
