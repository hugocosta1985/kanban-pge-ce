import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor() {}

  logError(message: string, error: any) {
    console.error(message, error);
  }
}
