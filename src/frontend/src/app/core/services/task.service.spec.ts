import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar tarefas (GET)', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Teste',
        status: 'A Fazer',
        priority: 'Baixa',
        tags: [],
      },
    ];

    service.getAll().subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual(mockTasks as any);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tarefas`);

    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });
});
