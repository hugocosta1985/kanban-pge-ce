import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStateService } from '../../../core/services/task-state.service';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-urgent-badge',
  standalone: true,
  imports: [CommonModule, BadgeModule, TooltipModule],
  templateUrl: './urgent-badge.component.html',
  styleUrl: './urgent-badge.component.scss',
})
export class UrgentBadgeComponent {
  private taskState = inject(TaskStateService);
  urgentTasksCount = computed(() => this.taskState.urgentTasksCount());
  hasUrgentTasks = computed(() => this.urgentTasksCount() > 0);
}
