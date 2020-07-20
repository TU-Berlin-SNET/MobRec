import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { GoogleNearby } from '@ionic-native/google-nearby/ngx';
import { NearbyDevicesActions } from '../../store/nearbyDevices/actions';
import { AppState } from '../../store/store';
import { SimilarityService } from './similarity.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  p2pkit;
  message;
  constructor(
    private permissions: AndroidPermissions,
    private store: NgRedux<AppState>,
    private nearbyDevicesActions: NearbyDevicesActions,
    private nearby: GoogleNearby,
    private device: Device,
    private geoLocation: BackgroundGeolocation,
    private similarityService: SimilarityService
  ) {}

  async getPeersFromDatabase(): Promise<any> {
    if (this.device.platform && this.device.platform !== 'iOS') {
      const db = (window as any).sqlitePlugin.openDatabase({
        name: 'db.mobirec',
        location: 'default',
        androidDatabaseProvider: 'system'
      });
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS NearbyDevices(Name VARCHAR,Timestamp int,Location VARCHAR,
                Matrix VARCHAR, Nickname VARCHAR, Id VARCHAR);`,
          [],
          (tx, rs) => {
            tx.executeSql(
              'SELECT * FROM NearbyDevices',
              [],
              (tx, rs) => {
                const length = rs.rows.length;
                for (let i = 0; i < length; i++) {
                  const location = JSON.parse(rs.rows.item(i).Location);
                  const matrix1 = JSON.parse(rs.rows.item(i).Matrix);
                  const matrix2 = this.store.getState().locations.countMin
                    ._matrix;
                  console.log('peer location', location);
                  const similarity = matrix1
                    ? this.similarityService.calculateSimilarity(
                        matrix1,
                        matrix2
                      )
                    : 0;
                  this.nearbyDevicesActions.addOrUpdatePeer(
                    {
                      urlKey: rs.rows.item(i).Name,
                      timestamp: rs.rows.item(i).Timestamp,
                      location: {
                        latitude: location.mLatitude,
                        longitude: location.mLongitude
                      },
                      id: rs.rows.item(i).Id,
                      nickname: rs.rows.item(i).Nickname
                    },
                    similarity
                  );
                }
                tx.executeSql('DELETE from NearbyDevices', [], (tx, rs) => {
                  console.log(rs.rows.length);
                });
              },
              (tx, error) => {
                console.log('SELECT error: ' + error.message);
                db.close();
                return Promise.reject();
              },
              () => {
                console.log('Transaction OK');
                db.close();
                return Promise.resolve();
              }
            );
          }
        );
      });
    } else {
      return Promise.resolve();
    }
  }

  requestPermission(): Promise<any> {
    return this.permissions
      .checkPermission(this.permissions.PERMISSION.ACCESS_COARSE_LOCATION)
      .then(
        result => {
          console.log('Has permission?', result.hasPermission);
          if (!result.hasPermission) {
            return this.permissions.requestPermission(
              this.permissions.PERMISSION.ACCESS_COARSE_LOCATION
            );
          }
        },
        err =>
          this.permissions.requestPermission(
            this.permissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
      );
  }

  startNearbySubscribe() {
    this.nearby.subscribe().subscribe(async msg => {
      const timestamp = Date.now();
      console.log('nearby message found', msg);
      if (this.device.platform === 'iOS') {
        const location = await this.geoLocation.getCurrentLocation();
        const matrix1 = JSON.parse(msg).countMin;
        const matrix2 = this.store.getState().locations.countMin._matrix;
        console.log('peer location', location);
        const similarity = matrix1
          ? this.similarityService.calculateSimilarity(matrix1, matrix2)
          : 0;
        this.nearbyDevicesActions.addOrUpdatePeer(
          {
            urlKey: JSON.parse(msg).urlKey,
            timestamp,
            location,
            nickname: JSON.parse(msg).nickname,
            id: JSON.parse(msg).id
          },
          similarity
        );
      }
    });
    console.log('subscribing nearby devices');
  }

  async startNearbyPublish() {
    const profileKey = this.store.getState().profile.shortUrlKey;
    const matrix = this.store.getState().locations.countMin._matrix;
    const user = this.store.getState().profile;
    const name = this.device.uuid;
    const json = {
      name,
      urlKey: profileKey,
      countMin: null,
      nickname: null,
      id: user.id
    };
    if (this.store.getState().profile.sendSimilarity) {
      json.countMin = matrix;
    }
    if (this.store.getState().profile.sendNickname) {
      json.nickname = user.nickname;
    }
    const message = JSON.stringify(json);

    return this.nearby.publish(message).then(status => {
      console.log('publish nearby', status);
    });
  }
}
