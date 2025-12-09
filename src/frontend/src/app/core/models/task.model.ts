export type TaskPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type TaskStatus = 'A Fazer' | 'Em Andamento' | 'Concluído';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  tags: string[];
  status: TaskStatus;
}
