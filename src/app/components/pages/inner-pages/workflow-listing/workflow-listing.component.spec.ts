import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowListingComponent } from './workflow-listing.component';

describe('WorkflowListingComponent', () => {
  let component: WorkflowListingComponent;
  let fixture: ComponentFixture<WorkflowListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
