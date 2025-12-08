import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskService } from './task.service';
import { Task, TaskPriority } from '../models/task.model.component';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  private taskService = inject(TaskService);

  private tasks = signal<Task[]>([]);
  private searchFilter = signal<string>('');
  private priorityFilter = signal<TaskPriority | null>(null);
  private dateRangeFilter = signal<Date[] | null>(null);

  private priorityWeights: Record<string, number> = {
    Urgente: 4,
    Alta: 3,
    Média: 2,
    Baixa: 1,
  };

  readonly urgentTasksCount = computed(
    () =>
      this.tasks().filter(
        (t) => t.priority === 'Urgente' && t.status !== 'Concluído'
      ).length
  );

  readonly tasksByStatus = computed(() => {
    const term = this.searchFilter().toLowerCase();
    const priority = this.priorityFilter();
    const dateRange = this.dateRangeFilter();
    const allTasks = this.tasks();

    const filtered = allTasks.filter((task) => {
      const matchesText =
        task.title.toLowerCase().includes(term) ||
        task.tags.some((tag) => tag.toLowerCase().includes(term));

      const matchesPriority = priority ? task.priority === priority : true;

      let matchesDate = true;
      if (dateRange && dateRange[0]) {
        if (!task.dueDate) {
          matchesDate = false;
        } else {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);

          const start = new Date(dateRange[0]);
          start.setHours(0, 0, 0, 0);

          const end = dateRange[1] ? new Date(dateRange[1]) : null;
          if (end) end.setHours(23, 59, 59, 999);

          if (end) {
            matchesDate = taskDate >= start && taskDate <= end;
          } else {
            matchesDate = taskDate >= start;
          }
        }
      }

      return matchesText && matchesPriority && matchesDate;
    });

    const sorted = filtered.sort((a, b) => {
      const weightA = this.priorityWeights[a.priority] || 0;
      const weightB = this.priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });

    return {
      'A Fazer': sorted.filter((t) => t.status === 'A Fazer'),
      'Em Andamento': sorted.filter((t) => t.status === 'Em Andamento'),
      Concluído: sorted.filter((t) => t.status === 'Concluído'),
    };
  });

  loadTasks() {
    this.taskService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }

  deleteTask(taskId: string) {
    this.tasks.update((current) => current.filter((t) => t.id !== taskId));
    this.taskService.delete(taskId).subscribe({
      error: (err) => console.warn('API Error:', err),
    });
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find((t) => t.id === id);
  }

  setSearchFilter(term: string) {
    this.searchFilter.set(term);
  }
  setPriorityFilter(priority: TaskPriority | null) {
    this.priorityFilter.set(priority);
  }
  setDateRangeFilter(range: Date[] | null) {
    this.dateRangeFilter.set(range);
  }
}
