import { NgRedux, select } from '@angular-redux/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MusicActions } from '../../../store/music/actions';
import { ProfileActions } from '../../../store/profile/actions';
import { AppState } from '../../../store/store';
import { Music, Profile } from '../../models';
import { DatabaseService } from '../../services/database.service';

declare var SafariViewController;

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss']
})
export class MusicPage implements OnInit {
  config = {
    clientId: '4492b345e0dc42cfbd2cbf6cf920b206',
    redirectUrl: 'com.eggersimone.mobirec://callback/test',
    scopes: [
      'user-read-recently-played',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read'
    ], // see Spotify Dev console for all scopes
    tokenExchangeUrl:
      'https://2lkqd24l69.execute-api.eu-central-1.amazonaws.com/dev/exchange',
    tokenRefreshUrl:
      'https://2lkqd24l69.execute-api.eu-central-1.amazonaws.com/dev/refresh'
  };


  @select(['profile'])
  readonly profile$: Observable<Profile>;

  @select(['music'])
  readonly music$: Observable<Music>;

  profile;
  top = [];
  recentlyPlayed;
  recommendedTop = [];
  recommendedRecentlyPlayed = [];

  showTracks = false;
  destroy$ = new Subject<void>();
  activeSegment = 'top';
  spotify;
  isPlayingTop = [];
  isPlayingRecent = [];
  isPlayingNearby = [];

  fromNearby = [];
  recommendedNearby = [];

  constructor(
    private profileActions: ProfileActions,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private musicActions: MusicActions,
    private cf: ChangeDetectorRef,
    private iab: InAppBrowser,
    private dbService: DatabaseService,
    private store: NgRedux<AppState>,
    private nav: NavController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => (this.profile = profile));

    this.music$.pipe(takeUntil(this.destroy$)).subscribe(music => {
      this.top = music.top;
      this.recentlyPlayed = music.recentlyPlayed;
      this.fromNearby = music.fromNearby;
    });
    this.spotifyAuth();
  }

  openUrl(url: string) {
    SafariViewController.show({url});
    // this.iab.create(url, '_sytstem');
  }

  onSegmentChange() {
    this.cf.detectChanges();
  }

  getSpotfiyCredentials(): Promise<any> {
    return (cordova.plugins as any).spotifyAuth.authorize(this.config);
  }

  async getRecomendationsFromNearby(): Promise<any> {
    const seed = this.fromNearby
      .map((item, index) => {
        if (index < 5) {
          return item.id;
        }
      })
      .join();
    (cordova.plugins as any).spotifyAuth
        .authorize(this.config)
        .then(async ({ accessToken, expiresAt }) => {
          console.log(`Got an access token, its ${accessToken}!`);
          console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
          const header = {
            headers: new HttpHeaders().set(
              'Authorization',
              'Bearer ' + accessToken
            )
          };
          this.http
          .get(
            'https://api.spotify.com/v1/recommendations?seed_tracks=' + seed,
            header
          )
          .subscribe(data => {
            console.log(data);
            const result = (data as any).tracks.map(item => {
              return {
                name: item.name,
                id: item.id,
                artists: item.artists.map(artist => {
                  return {
                    name: artist.name,
                    id: artist.id
                  };
                }),
                album: item.album,
                url: item.external_urls.spotify
              };
            });
            this.recommendedNearby = result;
            this.isPlayingNearby = this.recommendedNearby.map(i => false);
            return Promise.resolve();
          }, e => this.showErrorToast(e));
      });
  }

  async getRecommendations(type): Promise<any> {
    let tracks;
    if (type === 'top') {
      tracks = this.top;
    } else {
      tracks = this.recentlyPlayed;
    }
    const seed = tracks
      .map((item, index) => {
        if (index < 5) {
          return item.id;
        }
      })
      .join();
    return new Promise((resolve, reject) => {
      (cordova.plugins as any).spotifyAuth
        .authorize(this.config)
        .then(async ({ accessToken, expiresAt }) => {
          console.log(`Got an access token, its ${accessToken}!`);
          console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
          const header = {
            headers: new HttpHeaders().set(
              'Authorization',
              'Bearer ' + accessToken
            )
          };
          this.http
            .get(
              'https://api.spotify.com/v1/recommendations?seed_tracks=' + seed,
              header
            )
            .subscribe(data => {
              console.log(data);
              const result = (data as any).tracks.map(item => {
                return {
                  name: item.name,
                  id: item.id,
                  artists: item.artists.map(artist => {
                    return {
                      name: artist.name,
                      id: artist.id
                    };
                  }),
                  album: item.album,
                  url: item.external_urls.spotify
                };
              });
              if (type === 'top') {
                this.recommendedTop = result;
                this.isPlayingTop = this.recommendedTop.map(i => false);
                resolve();
              } else {
                this.recommendedRecentlyPlayed = result;
                this.isPlayingRecent = this.recommendedRecentlyPlayed.map(
                  i => false
                );
                resolve();
              }
            }, e => {
              this.showErrorToast(e);
            });
        });
    });
  }

  pauseTrack(index, type) {
    (cordova.plugins as any).spotifyAuth
      .authorize(this.config)
      .then(async ({ accessToken, expiresAt }) => {
        (cordova.plugins as any).spotify.pause().then(() => {
          if (type === 'top') {
            this.isPlayingTop[index] = false;
          } else if (type === 'recent') {
            this.isPlayingRecent[index] = false;
          } else {
            this.isPlayingNearby[index] = false;
          }
        });
      });
  }

  async doRefresh(event) {
    await this.getRecommendations(this.activeSegment);
    await this.getRecomendationsFromNearby();
    event.target.complete();
  }

  playTrack(id, index, type) {
    this.isPlayingRecent = this.isPlayingRecent.map(i => false);
    this.isPlayingTop = this.isPlayingTop.map(i => false);
    (cordova.plugins as any).spotifyAuth
      .authorize(this.config)
      .then(async ({ accessToken, expiresAt }) => {
        (cordova.plugins as any).spotify
          .pause()
          .then(() => {
            (cordova.plugins as any).spotify
              .play('spotify:track:' + id, {
                clientId: this.config.clientId,
                token: accessToken
              })
              .then(() => {
                if (type === 'top') {
                  this.isPlayingTop[index] = true;
                } else if (type === 'recent') {
                  this.isPlayingRecent[index] = true;
                } else {
                  this.isPlayingNearby[index] = true;
                }
                console.log('Music is playing 🎶');
              });
          })
          .catch(e => {
            console.error(e);
            this.showErrorToast(e);
          });
      });
  }

  toggleTracks() {
    this.showTracks = !this.showTracks;
  }

  play(id) {
    (cordova.plugins as any).spotifyAuth
      .authorize(this.config)
      .then(async ({ accessToken, expiresAt }) => {
        (cordova.plugins as any).spotify
          .play('spotify:track:' + id, {
            clientId: this.config.clientId,
            token: accessToken
          })
          .then(() => console.log('Music is playing 🎶'));
      });
  }
  close() {
    this.nav.navigateRoot(['tabs']);
  }

  async showErrorToast(msg) {
    // const toast = await this.toastCtrl.create({
    //   message: msg,
    //   duration: 2000
    // });
    // toast.present();
  }

  addTracksToDatabase(tracks) {
    const user = this.store.getState().profile;
    const promises = tracks.map(track => {
      const id = track.id ? track.id : track.track.id;
      return this.dbService.addTrackToDatabase(id, user.id);
    });
    return Promise.all(promises);
  }

  async spotifyAuth() {
    (cordova.plugins as any).spotifyAuth
      .authorize(this.config)
      .then(async ({ accessToken, expiresAt }) => {
        console.log(`Got an access token, its ${accessToken}!`);
        console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
        this.musicActions.updateSpotify();
        const header = {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + accessToken
          )
        };
        this.http
          .get('https://api.spotify.com/v1/me/player/recently-played', header)
          .subscribe(data => {
            console.log(data);
            this.musicActions.updateRecentlyPlayed(data);
            this.addTracksToDatabase((data as any).items);
            this.getRecommendations('recent');
        });
        this.http
          .get('https://api.spotify.com/v1/me/top/tracks', header)
          .subscribe(data => {
            console.log(data);
            this.musicActions.updateTopTracks(data);
            this.addTracksToDatabase((data as any).items);
            this.getRecommendations('top');
          }, e => this.showErrorToast(e));
        const toast = await this.toastCtrl.create({
          message: 'Successfully connected to spotify',
          duration: 2000,
          position: 'middle'
        });
        toast.present();
        this.getRecomendationsFromNearby();
      })
      .catch(e => {
        console.error(e);
        this.showErrorToast((e as any).message);
      });
  }
}
