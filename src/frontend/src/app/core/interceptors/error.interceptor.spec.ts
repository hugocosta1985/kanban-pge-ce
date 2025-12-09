import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LogService } from '../services/log.service';
import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let logServiceSpy: jasmine.SpyObj<LogService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    logServiceSpy = jasmine.createSpyObj('LogService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: LogService, useValue: logServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar o header X-API-Key', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    expect(req.request.headers.has('X-API-Key')).toBeTrue();
    expect(req.request.headers.get('X-API-Key')).toBe(
      'simulacao-pge-ceara-token'
    );

    req.flush({});
  });

  it('deve capturar erro 500 e chamar o MessageService', () => {
    const errorMsg = 'Erro interno simulado';

    httpClient.get('/test').subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/test');

    req.flush(errorMsg, { status: 500, statusText: 'Server Error' });

    expect(logServiceSpy.error).toHaveBeenCalled();

    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'error',
        summary: 'Erro no Servidor',
      })
    );
  });
});
