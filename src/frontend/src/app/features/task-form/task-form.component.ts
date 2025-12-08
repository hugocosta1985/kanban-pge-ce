import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { TaskStateService } from '../../core/services/task-state.service';
import { Task, TaskPriority, TaskStatus } from '../../core/models/task.model';
import { forbiddenWordValidator } from '../../shared/directives/forbidden-word.validator';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
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
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  minDate = new Date();

  form!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;

  priorities: TaskPriority[] = ['Baixa', 'Média', 'Alta', 'Urgente'];
  statusOptions: TaskStatus[] = ['A Fazer', 'Em Andamento', 'Concluído'];

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
    this.setupValidationReactors();
  }

  private initForm() {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          forbiddenWordValidator(),
        ],
      ],
      description: [''],
      priority: ['Baixa' as TaskPriority, Validators.required],
      status: ['A Fazer' as TaskStatus, Validators.required],
      dueDate: [null],
      tags: [[]],
    });
  }

  private setupValidationReactors() {
    this.form.get('priority')?.valueChanges.subscribe((priority) => {
      this.form.markAllAsTouched();
      const dateControl = this.form.get('dueDate');

      if (priority === 'Urgente') {
        dateControl?.setValidators([Validators.required]);
      } else {
        dateControl?.clearValidators();
      }
      dateControl?.updateValueAndValidity();
      this.form.updateValueAndValidity();
      this.cdr.markForCheck();
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = id;
      const task = this.taskState.getTaskById(id);
      if (task) {
        const patchData = {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        };
        this.form.patchValue(patchData);
      }
    }
  }

  onSubmit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha os campos obrigatórios corretamente.',
      });
      return;
    }

    const taskData: Task = {
      id: this.taskId || this.generateTempId(),
      ...this.form.value,
    };

    if (this.isEditMode && this.taskId) {
      this.taskState.updateTask(taskData);
    } else {
      this.taskState.addTask(taskData);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Tarefa salva!',
    });
    this.router.navigate(['/']);
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  private generateTempId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
