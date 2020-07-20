import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, Platform } from '@ionic/angular';
import BackgroundFetch from 'cordova-plugin-background-fetch';
import { AppState } from '../store/store';
import { CommunicationService } from './services/communication.service';
import { DataService } from './services/data.service';
import { LocationService } from './services/location.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private communicationService: CommunicationService,
    private store: NgRedux<AppState>,
    private navCtrl: NavController,
    private locationService: LocationService,
    private backgroundFetch: BackgroundFetch,
    private dataService: DataService
  ) {
   this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByName('white');
      this.splashScreen.hide();

      const fetchCallback = async () => {
        console.log('[js] BackgroundFetch event received');
        await this.dataService.initializeGoogleDrive();
        BackgroundFetch.finish();
      };

      const failureCallback = (error) => {
          console.error('- BackgroundFetch failed', error);
      };

      BackgroundFetch.configure(fetchCallback, failureCallback, {
          minimumFetchInterval: 500
      });

      if (this.store.getState().profile.googleAuth) {
        this.navCtrl.navigateRoot('home');
      }

      // start recording location
      setTimeout(() => {
        this.locationService.startTracking();
      }, 3000);
    });
  }
}
