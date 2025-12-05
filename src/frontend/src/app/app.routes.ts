import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Kanban - PGE-CE',
    loadComponent: () =>
      import('./features/kanban-board/kanban-board.component').then(
        (m) => m.KanbanBoardComponent
      ),
  },
  {
    path: 'nova-tarefa',
    title: 'Nova Tarefa',
    loadComponent: () =>
      import('./features/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: 'editar-tarefa/:id',
    title: 'Editar Tarefa',
    loadComponent: () =>
      import('./features/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
