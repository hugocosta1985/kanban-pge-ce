import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentBadgeComponent } from './urgent-badge.component';

describe('UrgentBadgeComponent', () => {
  let component: UrgentBadgeComponent;
  let fixture: ComponentFixture<UrgentBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrgentBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
