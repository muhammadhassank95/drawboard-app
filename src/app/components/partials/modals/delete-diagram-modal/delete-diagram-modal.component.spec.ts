import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDiagramModalComponent } from './delete-diagram-modal.component';

describe('DeleteDiagramModalComponent', () => {
  let component: DeleteDiagramModalComponent;
  let fixture: ComponentFixture<DeleteDiagramModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDiagramModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDiagramModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
