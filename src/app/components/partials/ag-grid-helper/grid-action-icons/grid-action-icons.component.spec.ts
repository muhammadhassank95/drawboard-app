import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionIconsComponent } from './grid-action-icons.component';

describe('GridActionIconsComponent', () => {
  let component: GridActionIconsComponent;
  let fixture: ComponentFixture<GridActionIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridActionIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridActionIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
