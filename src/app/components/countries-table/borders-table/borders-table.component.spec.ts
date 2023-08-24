import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordersTableComponent } from './borders-table.component';

describe('BordersTableComponent', () => {
  let component: BordersTableComponent;
  let fixture: ComponentFixture<BordersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BordersTableComponent]
    });
    fixture = TestBed.createComponent(BordersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
