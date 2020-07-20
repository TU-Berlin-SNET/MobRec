import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { Google } from 'ng2-cordova-oauth/core';
import { OauthSafariController } from 'ng2-cordova-oauth/platform/safari';
// import { Google, OauthCordova } from 'ionic-cordova-oauth';
import { MovieActions } from '../../store/movies/actions';
import { MusicActions } from '../../store/music/actions';
import { NearbyDevicesActions } from '../../store/nearbyDevices/actions';
import { ProfileActions } from '../../store/profile/actions';
import { AppState } from '../../store/store';
import { DatabaseService } from './database.service';

declare var SafariViewController;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private oauth: OauthSafariController;
  private googleProvider: Google;
  constructor(
    private store: NgRedux<AppState>,
    private http: HttpClient,
    private nativeHttp: HTTP,
    private nearbyDevicesActions: NearbyDevicesActions,
    private profileActions: ProfileActions,
    private movieActions: MovieActions,
    private platform: Platform,
    private deeplinks: Deeplinks,
    private dbService: DatabaseService,
    private musicActions: MusicActions
  ) {
    (window as any).handleOpenURL = (url) => {
      if (SafariViewController) {
          SafariViewController.hide();
      }
      console.log(url);
  };
  }

  initializeGoogleDrive(): Promise<any> {
    return this.platform.ready().then(() => {
      this.oauth = new OauthSafariController();
      this.googleProvider = new Google({
        clientId:
          'INSERT_HERE',
        appScope: ['https://www.googleapis.com/auth/drive.file'],
        responseType: 'code',
        redirectUri: 'com.eggersimone.mobirec:/login?mobile=1'
      });
      return this.checkAuthAndUploadFile();
    });
  }



  googleAuth(): Promise<any> {
    console.log('starting google auth');
    return this.oauth.logInVia(this.googleProvider).then(success => {
      console.log('SUCCESS: ', success);
      return new Promise((resolve, reject) => {
        this.http
          .post(
            'https://oauth2.googleapis.com/token',
            {
              code: (success as any).code,
              client_id:
                'INSERT_HERE',
              grant_type: 'authorization_code',
              redirect_uri: 'com.eggersimone.mobirec:/login?mobile=1'
            },
            {}
          )
          .subscribe(
            data => {
              console.log(data);
              this.profileActions.googleAuth({
                token: (data as any).access_token,
                refreshToken: (data as any).refresh_token
              });
              return resolve();
            },
            error => {
              reject(error);
            }
          );
      });
    }).catch(e => console.error(e));
  }

  async checkAuthAndUploadFile() {
    console.log('check auth and upload file');
    const googleAuth = this.store.getState().profile.googleAuth;
    if (googleAuth && googleAuth.refreshToken) {
      console.log('already have google auth?');
      const header = {
        Authorization: 'Bearer ' + googleAuth.token
      };
      return this.nativeHttp
        .get('https://www.googleapis.com/drive/v3/files', null, header)
        .then(data => {
          console.log('google auth finished');
          return this.uploadFile();
        })
        .catch(error => {
          const refreshToken = this.store.getState().profile.googleAuth
            .refreshToken;
          console.log(refreshToken);
          return this.nativeHttp
            .post(
              'https://oauth2.googleapis.com/token',
              {
                client_id:
                  'INSERT_HERE',
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
              },
              {}
            )
            .then(data => {
              console.log('google data', data);
              const response = JSON.parse(data.data);
              this.profileActions.googleAuth({
                token: response.access_token
              });
              console.log('google auth finished');
              return this.uploadFile();
            })
            .catch(e => Promise.reject(e));
        });
    } else {
      console.log('try starting google auth');
      await this.googleAuth();
      return this.uploadFile();
    }
  }

  generateFile() {
    const jsonData = { movies: [], music: [] };
    if (this.store.getState().profile.sendMovies) {
      const movies = this.store
        .getState()
        .movies.movies.filter(movie => movie.rating > 3);
      jsonData.movies = movies;
    }
    if (this.store.getState().profile.sendMusic) {
      let music = this.store.getState().music.top;
      music = [...music, ...this.store.getState().music.recentlyPlayed];
      jsonData.music = music;
    }
    return jsonData;
  }

  async uploadFile(): Promise<any> {
    console.log('file upload started');
    const googleAuth = this.store.getState().profile.googleAuth;
    const jsonData = this.generateFile();
    const header = {
      Authorization: 'Bearer ' + googleAuth.token
    };
    return new Promise(async (resolve, reject) => {
      this.nativeHttp.setDataSerializer('json');
      const alreadyUploaded = this.store.getState().profile.cloudProviderId;

      if (!alreadyUploaded) {
        this.nativeHttp
          .post(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=media',
            jsonData,
            header
          )
          .then(data => {
            console.log('file upload finished');
            const response = JSON.parse(data.data);
            console.log(response);
            this.profileActions.updateCloudProviderId(response.id);
            const name = 'mobirecData';
            this.nativeHttp
              .patch(
                'https://www.googleapis.com/drive/v3/files/' + response.id,
                { name },
                header
              )
              .then(() => {
                // console.log(data);
              });

            this.nativeHttp
              .get(
                'https://www.googleapis.com/drive/v3/files/' +
                  response.id +
                  '?fields=*',
                null,
                header
              )
              .then(result => {
                const resp = JSON.parse(result.data);
                const url = resp.webContentLink;
                this.profileActions.updateWebContentLink(url);
                console.log('file url received');
                this.nativeHttp
                  .post(
                    'https://www.googleapis.com/drive/v3/files/' +
                      resp.id +
                      '/permissions',
                    {
                      role: 'reader',
                      type: 'anyone',
                      allowFileDiscovery: false
                    },
                    header
                  )
                  .then(async () => {
                    console.log('file permission added');
                    const keys = await this.generateShortUrl(url);
                    this.profileActions.updateShortUrl(keys[0], keys[1]);
                    return resolve();
                  });
              });
          });
      } else {
        const id = this.store.getState().profile.cloudProviderId;
        this.nativeHttp
          .patch(
            'https://www.googleapis.com/upload/drive/v3/files/' +
              id +
              '?uploadType=media',
            jsonData,
            header
          )
          .then(async data => {
            console.log(data.data);
            const response = JSON.parse(data.data);
            // const url = this.store.getState().profile.webContentLink;
            // const keys = await this.generateShortUrl(url);
            // this.profileActions.updateShortUrl(keys[0], keys[1]);
            return resolve();
          });
      }
    });
  }

  //   export interface Peer {
  //     urlKey: string,
  //     lastMet: number,
  //     locations: Location[],
  //     count: number,
  //     retrieved: boolean
  // }

  async downloadFiles(): Promise<any> {
    console.log('start downloading files');
    const peers = this.store.getState().nearbyDevices.nearbyPeers.filter(peer => peer.retrieved === false && peer.urlKey);
    const unretrievedPeers = [];
    const promises = peers.map(async peer => {
      if (peer.retrieved === false && peer.urlKey) {
        unretrievedPeers.push(peer);
        return this.nativeHttp.get(
          'https://rebrand.ly/' + peer.urlKey,
          null,
          null
        );
      }
    });
    Promise.all(promises).then((responses) => {
      responses.forEach(async (response, index) => {
        try {
          const data = JSON.parse(response.data);
          this.movieActions.updateNearbyMovies(data.movies, unretrievedPeers[index].urlKey);
          await this.dbService.addMoviesFromNearbyToDatabase(data.movies, unretrievedPeers[index].id);
          this.musicActions.updateTracksFromNearby(data.music, unretrievedPeers[index].id);
          this.dbService.addTracksFromNearbyToDatabase(data.music, unretrievedPeers[index].id);
          this.nearbyDevicesActions.setRetrieved(unretrievedPeers[index]);
        } catch (e) {
          return Promise.resolve();
        }
      });
    })
    .catch(e => {
      return Promise.reject();
    });
    return Promise.resolve();
  }

  generateShortUrl(url): Promise<any> {
    const header = {
      apiKey: 'df941d4bf6b24350bd605f4912440623'
    };
    const urlKey = this.store.getState().profile.shortUrlKey;
    const urlId = this.store.getState().profile.shortUrlId;
    if (!urlKey) {
      return new Promise((resolve, reject) => {
        this.nativeHttp
          .post(
            'https://api.rebrandly.com/v1/links',
            {
              title: 'mobirec' + urlId,
              destination: url
            },
            header
          )
          .then(data => {
            console.log('shortened url received');
            const response = JSON.parse(data.data);
            return resolve([response.slashtag, response.id]);
          })
          .catch(e => {
            return reject(e);
          });
      });
    }
  }

  getFile(url) {
    return this.nativeHttp.get(url, {}, {}).then(data => {
      const json = JSON.parse(data.data);
      console.log('get file jsno', json);
    });
  }
}
