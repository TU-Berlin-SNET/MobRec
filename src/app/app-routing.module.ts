import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleActivatedGuard } from './googleActivatedGuard';

const routes: Routes = [
  // { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  {
    path: 'movies',
    loadChildren: './pages/movies/movies.module#MoviesPageModule'
  },
  { path: '', loadChildren: './pages/start/start.module#StartPageModule', canActivate: [GoogleActivatedGuard] },
  { path: 'start', loadChildren: './pages/start/start.module#StartPageModule', canActivate: [GoogleActivatedGuard] },
  { path: 'music', loadChildren: './pages/music/music.module#MusicPageModule' },
  {
    path: 'movie-onboarding',
    loadChildren:
      './pages/movie-onboarding/movie-onboarding.module#MovieOnboardingPageModule'
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  },
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
