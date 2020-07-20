import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageModule } from '../home/home.module';
import { MovieOnboardingPageModule } from '../movie-onboarding/movie-onboarding.module';
import { MoviesPageModule } from '../movies/movies.module';
import { SettingsPageModule } from '../settings/settings.module';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.router.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    MoviesPageModule,
    ReactiveFormsModule,
    MovieOnboardingPageModule,
    SettingsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
