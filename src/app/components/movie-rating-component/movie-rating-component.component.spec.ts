import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieRatingComponentComponent } from './movie-rating-component.component';

describe('MovieRatingComponentComponent', () => {
  let component: MovieRatingComponentComponent;
  let fixture: ComponentFixture<MovieRatingComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieRatingComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieRatingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
