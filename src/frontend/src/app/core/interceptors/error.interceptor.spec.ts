import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './error.interceptor';
import { LogService } from '../services/log.service';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let logServiceSpy: jasmine.SpyObj<LogService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    logServiceSpy = jasmine.createSpyObj('LogService', ['logError']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LogService, useValue: logServiceSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve capturar um erro 500 e exibir um Toast de erro', () => {
    httpClient.get('/api/teste').subscribe({
      next: () => fail('A requisição deveria ter falhado'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/teste');

    req.flush('Erro interno', { status: 500, statusText: 'Server Error' });

    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'error',
        summary: 'Erro no Servidor',
      })
    );

    expect(logServiceSpy.logError).toHaveBeenCalled();
  });
});
