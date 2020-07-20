import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { LocationActions } from '../../store/location/actions';
import { AppState } from '../../store/store';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private locationActions: LocationActions,
    private dbService: DatabaseService,
    private store: NgRedux<AppState>
  ) {}

  startTracking() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 100,
      notificationsEnabled: false,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);
          this.locationActions.addLocation(location);
          const user = this.store.getState().profile;
          this.dbService.addLocation(user.id, location);

          this.backgroundGeolocation.startTask().then(key => {
            this.backgroundGeolocation.finish();
          });
        });
    });
    this.backgroundGeolocation.start();
  }
}
