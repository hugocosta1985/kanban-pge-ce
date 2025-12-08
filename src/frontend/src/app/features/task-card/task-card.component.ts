import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import {
  PRIORITY_COLORS,
  TaskPriority,
} from '../../shared/constants/task-priority-constants';

@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  task = input.required<Task>();

  edit = output<Task>();
  delete = output<Task>();

  prioritySeverity = computed(() => {
    const priority = this.task().priority as TaskPriority;
    return PRIORITY_COLORS[priority] || 'info';
  });
}
