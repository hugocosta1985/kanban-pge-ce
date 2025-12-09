import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanBoardComponent } from './kanban-board.component';
import { TaskStateService } from '../../core/services/task-state.service';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KanbanBoardComponent', () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  const taskStateServiceMock = {
    loadTasks: jasmine.createSpy('loadTasks'),
    deleteTask: jasmine.createSpy('deleteTask'),
    reorderTask: jasmine.createSpy('reorderTask'),
    updateTaskStatus: jasmine.createSpy('updateTaskStatus'),
    setSearchFilter: jasmine.createSpy('setSearchFilter'),
    setPriorityFilter: jasmine.createSpy('setPriorityFilter'),
    setDateRangeFilter: jasmine.createSpy('setDateRangeFilter'),

    tasks: signal([]),
    tasksByStatus: computed(() => ({
      'A Fazer': [],
      'Em Andamento': [],
      Concluído: [],
    })),
    urgentTasksCount: computed(() => 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: TaskStateService, useValue: taskStateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar tarefas ao iniciar', () => {
    expect(taskStateServiceMock.loadTasks).toHaveBeenCalled();
  });
});
