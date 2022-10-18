import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPagesComponent } from './entry-pages.component';

describe('EntryPagesComponent', () => {
  let component: EntryPagesComponent;
  let fixture: ComponentFixture<EntryPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
