import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { GoogleNearby } from '@ionic-native/google-nearby/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import BackgroundFetch from 'cordova-plugin-background-fetch';
import { IonicRatingModule } from 'ionic4-rating';
import { AppState, store } from '../store/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { HelpComponent } from './components/help/help.component';
import { MovieDetailPopoverComponent } from './components/movie-detail-popover/movie-detail-popover.component';
import { MovieRatingComponentComponent } from './components/movie-rating-component/movie-rating-component.component';

@NgModule({
  declarations: [AppComponent, AlertComponent, MovieDetailPopoverComponent, MovieRatingComponentComponent, HelpComponent],
  entryComponents: [AlertComponent, MovieDetailPopoverComponent, MovieRatingComponentComponent, HelpComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      scrollAssist: false
    }),
    HttpClientModule,
    AppRoutingModule,
    NgReduxModule,
    FormsModule,
    IonicRatingModule
  ],
  providers: [
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SplashScreen,
    Camera,
    FilePath,
    InAppBrowser,
    AndroidPermissions,
    HTTP,
    File,
    GoogleNearby,
    Device,
    BackgroundGeolocation,
    LocalNotifications,
    SQLite,
    Deeplinks,
    BackgroundFetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    ngRedux.provideStore(store);
  }
}
