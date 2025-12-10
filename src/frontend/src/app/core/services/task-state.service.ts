import { Injectable, signal, computed, inject, Signal } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
import { TaskService } from './task.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export type TasksGrouped = Record<TaskStatus, Task[]>;

@Injectable({ providedIn: 'root' })
export class TaskStateService {
  private taskService = inject(TaskService);

  private _tasks = signal<Task[]>([]);
  private _searchFilter = signal<string>('');
  private _priorityFilter = signal<TaskPriority | null>(null);
  private _dateRangeFilter = signal<Date[] | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly searchFilter = this._searchFilter.asReadonly();
  readonly priorityFilter = this._priorityFilter.asReadonly();
  readonly dateRangeFilter = this._dateRangeFilter.asReadonly();

  readonly urgentTasksCount = computed(
    () =>
      this._tasks().filter(
        (t) => t.priority === 'Urgente' && t.status !== 'Concluído'
      ).length
  );

  readonly tasksByStatus = computed<TasksGrouped>(() => {
    const tasks = this._tasks();
    const term = this._searchFilter().toLowerCase();
    const priority = this._priorityFilter();
    const dateRange = this._dateRangeFilter();

    const filtered = tasks.filter((task) =>
      this.matchesFilters(task, term, priority, dateRange)
    );

    return {
      'A Fazer': filtered.filter((t) => t.status === 'A Fazer'),
      'Em Andamento': filtered.filter((t) => t.status === 'Em Andamento'),
      'Concluído': filtered.filter((t) => t.status === 'Concluído'),
    };
  });

  loadTasks() {
    this.taskService.getAll().subscribe((tasks) => this._tasks.set(tasks));
  }

  addTask(task: Task) {
    this._tasks.update((current) => [...current, task]);

    this.taskService.create(task).subscribe({
      error: (err) => {
        console.error('Falha ao criar, revertendo...', err);
        this._tasks.update((t) => t.filter((x) => x.id !== task.id));
      },
    });
  }

  updateTask(updatedTask: Task) {
    this._tasks.update((current) =>
      current.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    this.taskService.update(updatedTask).subscribe();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasksByStatus()[status];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find((t) => t.id === id);
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const task = this._tasks().find((t) => t.id === taskId);
    if (task) {
      this.taskService.update(task).subscribe();
    }
  }

  deleteTask(taskId: string) {
    const previousTasks = this._tasks();
    this._tasks.update((current) => current.filter((t) => t.id !== taskId));

    this.taskService.delete(taskId).subscribe({
      error: (err) => {
        console.error('Erro ao deletar, revertendo...', err);
        this._tasks.set(previousTasks);
      },
    });
  }

  reorderTask(status: TaskStatus, previousIndex: number, currentIndex: number) {
    this._tasks.update((allTasks) => {
      const tasksInColumn = allTasks.filter((t) => t.status === status);

      moveItemInArray(tasksInColumn, previousIndex, currentIndex);

      const otherTasks = allTasks.filter((t) => t.status !== status);
      return [...otherTasks, ...tasksInColumn];
    });
  }

  setSearchFilter(term: string) {
    this._searchFilter.set(term);
  }
  setPriorityFilter(p: TaskPriority | null) {
    this._priorityFilter.set(p);
  }
  setDateRangeFilter(r: Date[] | null) {
    this._dateRangeFilter.set(r);
  }

  private matchesFilters(
    task: Task,
    term: string,
    priority: TaskPriority | null,
    dateRange: Date[] | null
  ): boolean {
    const matchesText =
      !term ||
      task.title.toLowerCase().includes(term) ||
      task.tags.some((tag) => tag.toLowerCase().includes(term));

    const matchesPriority = !priority || task.priority === priority;

    const matchesDate = this.isDateInRange(task.dueDate, dateRange);

    return matchesText && matchesPriority && matchesDate;
  }

  private isDateInRange(
    dateStr: string | Date | undefined,
    range: Date[] | null
  ): boolean {
    if (!range || !range[0]) return true;
    if (!dateStr) return false;

    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);

    const start = new Date(range[0]);
    start.setHours(0, 0, 0, 0);

    const end = range[1] ? new Date(range[1]) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (end) {
      return taskDate >= start && taskDate <= end;
    }
    return taskDate >= start;
  }
}
