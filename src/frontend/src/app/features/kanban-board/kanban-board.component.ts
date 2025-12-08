import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { TaskStateService } from '../../core/services/task-state.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Task, TaskPriority } from '../../core/models/task.model.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  private taskStateService = inject(TaskStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  isDeleteModalOpen = false;
  taskToDelete: Task | null = null;
  searchTerm = '';
  selectedPriority: TaskPriority | null = null;
  rangeDates: Date[] | undefined;

  ngOnInit() {
    this.taskStateService.loadTasks();
  }

  onCreateTask() {
    this.router.navigate(['/nova-tarefa']);
  }

  onEditTask(task: Task) {
    this.router.navigate(['/editar-tarefa', task.id]);
  }

  onDelete(task: Task) {
    this.taskToDelete = task;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.taskToDelete) {
      this.taskStateService.deleteTask(this.taskToDelete.id);
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
    this.taskStateService.setSearchFilter(term);
  }

  onPriorityChange(priority: TaskPriority | null) {
    this.taskStateService.setPriorityFilter(priority);
  }

  onDateRangeChange(range: Date[]) {
    this.taskStateService.setDateRangeFilter(range);
  }
}
