import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { UrgentBadgeComponent } from '../../shared/components/urgent-badge/urgent-badge.component';
import { Task, TaskStatus } from '../../core/models/task.model';
import { TaskStateService } from '../../core/services/task-state.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TaskPriority } from '../../core/models/task.model';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    DragDropModule,
    TaskCardComponent,
    ConfirmModalComponent,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DropdownModule,
    UrgentBadgeComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements OnInit {
  columns: TaskStatus[] = ['A Fazer', 'Em Andamento', 'Concluído'];
  priorityOptions: TaskPriority[] = ['Baixa', 'Média', 'Alta', 'Urgente'];

  private taskState = inject(TaskStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  isDeleteModalOpen = false;
  taskToDelete: Task | null = null;
  searchTerm = '';
  selectedPriority: TaskPriority | null = null;
  rangeDates: Date[] | undefined;

  ngOnInit() {
    this.taskState.loadTasks();
  }

  createTask() {
    this.router.navigate(['/nova-tarefa']);
  }

  onEdit(task: Task) {
    this.router.navigate(['/editar-tarefa', task.id]);
  }

  onDateRangeChange(range: Date[]) {
    this.taskState.setDateRangeFilter(range);
  }

  onDelete(task: Task) {
    this.taskToDelete = task;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.taskToDelete) {
      this.taskState.deleteTask(this.taskToDelete.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Tarefa excluída corretamente',
      });

      this.taskToDelete = null;
      this.isDeleteModalOpen = false;
    }
  }

  onSearchChange(term: string) {
    this.taskState.setSearchFilter(term);
  }

  onPriorityChange(priority: TaskPriority | null) {
    this.taskState.setPriorityFilter(priority);
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

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.taskState.getTasksByStatus(status);
  }
}
