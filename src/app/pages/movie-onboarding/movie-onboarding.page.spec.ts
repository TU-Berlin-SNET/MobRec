import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieOnboardingPage } from './movie-onboarding.page';

describe('MovieOnboardingPage', () => {
  let component: MovieOnboardingPage;
  let fixture: ComponentFixture<MovieOnboardingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieOnboardingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieOnboardingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
