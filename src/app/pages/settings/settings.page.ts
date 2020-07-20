import { NgRedux, select } from '@angular-redux/store';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MusicActions } from '../../../store/music/actions';
import { ProfileActions } from '../../../store/profile/actions';
import { AppState } from '../../../store/store';
import { HelpComponent } from '../../components/help/help.component';
import { Music, Profile } from '../../models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  profileForm = new FormGroup({
    nickname: new FormControl(''),
    sendNickname: new FormControl(null),
    sendMovies: new FormControl(null),
    sendMusic: new FormControl(null),
    sendSimilarity: new FormControl(null)
  });
  settings;
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

  constructor(
    private popoverController: PopoverController,
    private profileActions: ProfileActions,
    private store: NgRedux<AppState>,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private musicActions: MusicActions
  ) {}

  ngOnInit() {
    this.profile$.subscribe(profile => {
      console.log(profile);
      const settings = {
        nickname: profile.nickname,
        sendNickname: profile.sendNickname,
        sendMovies: profile.sendMovies,
        sendMusic: profile.sendMusic,
        sendSimilarity: profile.sendSimilarity
      };
      Object.keys(settings).forEach(key => {
        this.profileForm.controls[key].setValue(settings[key]);
      });
      this.profileForm.valueChanges.subscribe(() => {
        this.cdr.detectChanges();
      });
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: HelpComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  save() {
    this.profileActions.updateSettings(this.profileForm.value);
  }

  loginSpotify() {
    (cordova.plugins as any).spotifyAuth.authorize(this.config)
      .then(async ({ accessToken, expiresAt }) => {
        console.log(`Got an access token, its ${accessToken}!`);
        console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
        this.musicActions.updateSpotify();
    })
    .catch(e => {
      console.error(e);
    });
  }

  forgetGoogle() {
    this.profileActions.resetGoogle();
  }

  loginWithGoogle() {
    this.dataService.initializeGoogleDrive();
  }

  forgetSpotify() {
    this.musicActions.updateSpotify();
    (cordova.plugins as any).spotifyAuth.forget();
  }
}
