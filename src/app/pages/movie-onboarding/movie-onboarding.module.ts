import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieOnboardingPage } from './movie-onboarding.page';
import { IonicRatingModule } from 'ionic4-rating';

const routes: Routes = [
  {
    path: '',
    component: MovieOnboardingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IonicRatingModule
  ],
  declarations: [MovieOnboardingPage],
  exports: [
    MovieOnboardingPage //<----- this is if it is going to be used else where
  ],
  entryComponents: [
    MovieOnboardingPage
  ]
})
export class MovieOnboardingPageModule {}
