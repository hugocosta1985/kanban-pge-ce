import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentBadgeComponent } from './urgent-badge.component';
import { TaskStateService } from '../../../core/services/task-state.service';
import { computed } from '@angular/core';

describe('UrgentBadgeComponent', () => {
  let component: UrgentBadgeComponent;
  let fixture: ComponentFixture<UrgentBadgeComponent>;

  const taskStateServiceMock = {
    urgentTasksCount: computed(() => 5),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrgentBadgeComponent],
      providers: [
        { provide: TaskStateService, useValue: taskStateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrgentBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o contador vindo do serviço', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('5');
  });
});
