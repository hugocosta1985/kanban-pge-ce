export type PrimeSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

export const TASK_PRIORITIES = ['Baixa', 'Média', 'Alta', 'Urgente'] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PRIORITY_COLORS: Record<TaskPriority, PrimeSeverity> = {
  Baixa: 'info',
  Média: 'warn',
  Alta: 'danger',
  Urgente: 'contrast',
};
