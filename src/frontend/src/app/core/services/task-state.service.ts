import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { TaskService } from './task.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({ providedIn: 'root' })
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

  getTasksByStatus(status: TaskStatus): Task[] {
    return (this.tasksByStatus() as any)[status] || [];
  }

  loadTasks() {
    this.taskService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }

  addTask(task: Task) {
    this.tasks.update((current) => [...current, task]);
    this.taskService.create(task).subscribe({
      error: (err) => console.warn('API Error (salvo localmente):', err),
    });
  }

  updateTask(updatedTask: Task) {
    this.tasks.update((current) =>
      current.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    this.taskService.update(updatedTask).subscribe({
      error: (err) => console.warn('API Error (salvo localmente):', err),
    });
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const task = this.tasks().find((t) => t.id === taskId);
    if (task) {
      this.taskService.update(task).subscribe();
    }
  }

  deleteTask(taskId: string) {
    this.tasks.update((current) => current.filter((t) => t.id !== taskId));
    this.taskService.delete(taskId).subscribe({
      error: (err) => console.warn('API Error:', err),
    });
  }

  reorderTask(status: TaskStatus, previousIndex: number, currentIndex: number) {
    this.tasks.update((allTasks) => {
      const tasksInColumn = allTasks.filter((t) => t.status === status);
      moveItemInArray(tasksInColumn, previousIndex, currentIndex);
      const otherTasks = allTasks.filter((t) => t.status !== status);
      return [...otherTasks, ...tasksInColumn];
    });
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

  getTaskById(id: string): Task | undefined {
    return this.tasks().find((t) => t.id === id);
  }
}
