import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailPopoverComponent } from './movie-detail-popover.component';

describe('MovieDetailPopoverComponent', () => {
  let component: MovieDetailPopoverComponent;
  let fixture: ComponentFixture<MovieDetailPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieDetailPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
