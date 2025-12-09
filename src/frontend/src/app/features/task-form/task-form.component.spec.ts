import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskStateService } from '../../core/services/task-state.service';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  let taskStateServiceMock: jasmine.SpyObj<TaskStateService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    taskStateServiceMock = jasmine.createSpyObj('TaskStateService', [
      'addTask',
      'getTaskById',
    ]);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskStateService, useValue: taskStateServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar o formulário inválido (campos obrigatórios vazios)', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('deve tornar a Data de Entrega OBRIGATÓRIA se Prioridade for "Urgente"', () => {
    const priorityControl = component.form.get('priority');
    const dateControl = component.form.get('dueDate');

    priorityControl?.setValue('Baixa');
    fixture.detectChanges();

    dateControl?.setValue(null);
    expect(dateControl?.valid).toBeTrue();

    priorityControl?.setValue('Urgente');
    fixture.detectChanges();

    dateControl?.setValue(null);
    expect(dateControl?.hasError('required')).toBeTrue();
    expect(component.form.valid).toBeFalse();
    dateControl?.setValue(new Date());
    expect(dateControl?.valid).toBeTrue();
  });

  it('deve validar palavras proibidas no Título', () => {
    const titleControl = component.form.get('title');

    titleControl?.setValue('Corrigir um bug crítico');

    expect(titleControl?.hasError('forbiddenWord')).toBeTrue();
    expect(titleControl?.valid).toBeFalse();
  });
});
