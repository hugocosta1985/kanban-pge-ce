import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../models/task.model.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiURL = 'http://localhost:3000';

  private http = inject(HttpClient);

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiURL}/tarefas`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiURL}/tarefas`, task);
  }

  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiURL}/tarefas/${task.id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/tarefas/${id}`);
  }
}
