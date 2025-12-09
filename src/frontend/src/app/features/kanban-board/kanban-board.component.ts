import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';

import { UrgentBadgeComponent } from '../../shared/components/urgent-badge/urgent-badge.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';
import { TaskStateService } from '../../core/services/task-state.service';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    DragDropModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DropdownModule,
    TaskCardComponent,
    UrgentBadgeComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements OnInit {
  readonly columns: TaskStatus[] = ['A Fazer', 'Em Andamento', 'Concluído'];
  readonly priorityOptions: TaskPriority[] = [
    'Baixa',
    'Média',
    'Alta',
    'Urgente',
  ];

  private readonly taskState = inject(TaskStateService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  searchTerm = signal('');
  selectedPriority = signal<TaskPriority | null>(null);
  rangeDates = signal<Date[] | undefined>(undefined);

  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  tasksGrouped = this.taskState.tasksByStatus;

  constructor() {}

  ngOnInit() {
    this.taskState.loadTasks();
  }

  createTask() {
    this.router.navigate(['/nova-tarefa']);
  }

  onEdit(task: Task) {
    this.router.navigate(['/editar-tarefa', task.id]);
  }

  openDeleteModal(task: Task) {
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const task = this.taskToDelete();
    if (task) {
      this.taskState.deleteTask(task.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Tarefa excluída corretamente',
      });

      this.closeDeleteModal();
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
    this.taskState.setSearchFilter(term);
  }

  updatePriority(priority: TaskPriority | null) {
    this.selectedPriority.set(priority);
    this.taskState.setPriorityFilter(priority);
  }

  updateDateRange(range: Date[]) {
    this.rangeDates.set(range);
    this.taskState.setDateRangeFilter(range);
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      this.taskState.reorderTask(
        newStatus as TaskStatus,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.item.data as Task;
      this.taskState.updateTaskStatus(task.id, newStatus as TaskStatus);
    }
  }
}
