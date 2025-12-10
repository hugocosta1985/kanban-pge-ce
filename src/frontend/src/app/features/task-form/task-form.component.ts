import {
  Component,
  OnInit,
  inject,
  input,
  effect,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { TaskStateService } from '../../core/services/task-state.service';
import { Task, TaskPriority, TaskStatus } from '../../core/models/task.model';
import { forbiddenWordValidator } from '../../shared/validators/forbidden-word.validator';
import { maxTagsValidator } from '../../shared/validators/max-tags.validator';
import { NgClass } from '@angular/common';

interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string | null>;
  priority: FormControl<TaskPriority>;
  status: FormControl<TaskStatus>;
  dueDate: FormControl<Date | null>;
  tags: FormControl<string[]>;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    DropdownModule,
    ChipsModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskState = inject(TaskStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  id = input<string>();

  readonly priorities: TaskPriority[] = ['Baixa', 'Média', 'Alta', 'Urgente'];
  readonly statusOptions: TaskStatus[] = [
    'A Fazer',
    'Em Andamento',
    'Concluído',
  ];
  readonly minDate = new Date();

  form!: FormGroup<TaskForm>;
  isEditMode = false;

  constructor() {
    effect(() => {
      const taskId = this.id();
      console.log('ID recebido pelo Router:', taskId);

      if (taskId) {
        this.isEditMode = true;
        this.loadTaskData(taskId);
      } else {
        console.warn('Nenhum ID detectado - Modo Criação');
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.setupValidationReactors();
  }

  private initForm() {
    this.form = this.fb.group<TaskForm>({
      title: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          forbiddenWordValidator(),
        ],
        nonNullable: true,
      }),
      description: new FormControl(''),
      priority: new FormControl('Baixa', { nonNullable: true }),
      status: new FormControl('A Fazer', { nonNullable: true }),
      dueDate: new FormControl(null),
      tags: new FormControl([], {
        nonNullable: true,
        validators: [maxTagsValidator(5)],
      }),
    });
  }

  private loadTaskData(id: string) {
    const task = this.taskState.getTaskById(id);

    if (task) {
      this.form.patchValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        tags: task.tags,
      });
      this.updateDateValidators(task.priority);
    }
  }

  private updateDateValidators(priority: TaskPriority) {
    const dateControl = this.form.controls.dueDate;

    if (priority === 'Urgente') {
      this.form.markAllAsTouched();
      if (!dateControl.hasValidator(Validators.required)) {
        dateControl.setValidators([Validators.required]);
      }
    } else {
      dateControl.clearValidators();
    }
    dateControl.updateValueAndValidity();
  }

  private setupValidationReactors() {
    this.form.controls.priority.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((priority) => {
        this.updateDateValidators(priority);
      });
  }

  onSubmit() {
    const rawValue = this.form.getRawValue();
    if (rawValue.priority === 'Urgente' && !rawValue.dueDate) {
      this.form.controls.dueDate.setErrors({ required: true });
      this.form.controls.dueDate.markAsTouched();

      this.messageService.add({
        severity: 'error',
        summary: 'Erro de Validação',
        detail: 'Tarefas Urgentes exigem uma Data de Entrega/Prazo.',
      });
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Atenção',
        detail: 'Verifique os campos obrigatórios.',
      });
      return;
    }

    const formData = this.form.getRawValue();

    const taskToSave: Task = {
      id: this.id() || crypto.randomUUID(),
      title: formData.title,
      description: formData.description || '',
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags,
      dueDate: formData.dueDate ? formData.dueDate.toISOString() : undefined,
    };

    if (this.isEditMode) {
      this.taskState.updateTask(taskToSave);
    } else {
      this.taskState.addTask(taskToSave);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Tarefa salva corretamente!',
    });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 100);
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
