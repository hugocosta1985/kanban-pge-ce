import { TestBed } from '@angular/core/testing';
import { TaskStateService } from './task-state.service';
import { TaskService } from './task.service';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskStateService', () => {
  let service: TaskStateService;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      status: 'A Fazer',
      priority: 'Baixa',
      tags: [],
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'Concluído',
      priority: 'Urgente',
      tags: [],
    },
    {
      id: '3',
      title: 'Task 3',
      status: 'Em Andamento',
      priority: 'Urgente',
      tags: [],
    },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TaskService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    spy.getAll.and.returnValue(of(mockTasks));

    TestBed.configureTestingModule({
      providers: [TaskStateService, { provide: TaskService, useValue: spy }],
    });
    service = TestBed.inject(TaskStateService);
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  it('deve carregar tarefas e calcular urgentTasksCount corretamente', () => {
    service.loadTasks();

    expect(service.tasks().length).toBe(3);

    expect(service.urgentTasksCount()).toBe(1);
  });

  it('deve filtrar tarefas por texto (searchFilter)', () => {
    service.loadTasks();

    service.setSearchFilter('Task 1');

    const groups = service.tasksByStatus();
    expect(groups['A Fazer'].length).toBe(1);
    expect(groups['Em Andamento'].length).toBe(0);
  });
});
