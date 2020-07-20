import { NgRedux, select } from '@angular-redux/store';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, Marker } from '@ionic-native/google-maps';
import { GoogleNearby } from '@ionic-native/google-nearby/ngx';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Google, OauthCordova } from 'ionic-cordova-oauth';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MovieActions } from '../../../store/movies/actions';
import { NearbyDevicesActions } from '../../../store/nearbyDevices/actions';
import { ProfileActions } from '../../../store/profile/actions';
import { Peer, Profile } from '../../models';
import { CommunicationService } from '../../services/communication.service';
import { DataService } from '../../services/data.service';
import { DatabaseService } from '../../services/database.service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  title;
  private oauth: OauthCordova = new OauthCordova();
  private googleProvider: Google = new Google({
    clientId:
      '599023475278-jb9g7f3f0qnsnpf9gff65f1d8oi7ottu.apps.googleusercontent.com',
    appScope: ['https://www.googleapis.com/auth/drive'],
    responseType: 'code',
    redirectUri: 'http://localhost'
  });
  @select(['nearbyDevices', 'nearbyPeers'])
  readonly links$: Observable<Peer[]>;

  @select(['movies', 'onboardingFinished'])
  readonly onboardingFinished$: boolean;

  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  @select(['profile'])
  readonly profile$: Observable<Profile>;

  @select(['_persist'])
  readonly persist$: Observable<any>;

  private subscription: Subscription;

  destroy$ = new Subject<void>();
  isAdvertising = false;
  isScanning = false;
  links;
  profile;
  p2pkit;
  messages = [];
  data;
  uuid;
  communication;
  locations;
  showLocations = false;
  showMovieOnboarding = true;
  mapLoaded = false;

  constructor(
    private navCtrl: NavController,
    private communicationService: CommunicationService,
    private toastCtrl: ToastController,
    private dataService: DataService,
    private store: NgRedux<any>,
    private router: Router,
    private cf: ChangeDetectorRef,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => (this.profile = profile));
  }

  ionViewDidEnter() {
    console.log('hallo');
  }

  async ngOnInit() {
    this.links$.subscribe(async links => {
      this.locations = links.map(link => {
        const peerLocations = link.meetingPoints.map(l => {
          return {
            name: link.urlKey,
            similarity: link.similarity,
            latitude: l.latitude,
            longitude: l.longitude,
            count: link.meetingPoints.length
          };
        });
        return peerLocations;
      });
      if (this.mapLoaded) {
        await this.map.clear();
        this.addMarkers();
        if (this.locations.length > 0) {
          const target = {
            lat: this.locations[0][0].latitude,
            lng: this.locations[0][0].longitude
          };
          this.map.moveCamera({
            target,
            zoom: 18,
            tilt: 30
          });
        }
      }
      console.log('locations', this.locations);
    });
    this.persist$.pipe(takeUntil(this.destroy$)).subscribe(async persist => {
      if (persist.rehydrated) {
        console.log('yeess');
        this.init();
      }
    });
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.urlAfterRedirects === '/tabs/(home:home)'
      ) {
        console.log(event);
        this.cf.detectChanges();
        this.onEnter();
      }
    });
  }

  public async onEnter(): Promise<void> {
    console.log('hellooo');
    this.communicationService.getPeersFromDatabase();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleLocations() {
    this.showLocations = !this.showLocations;
  }

  async init() {
    await this.communicationService.getPeersFromDatabase();
    this.loadMap();
    await this.dataService.initializeGoogleDrive();
    this.communicationService.startNearbyPublish();
    this.communicationService.startNearbySubscribe();
    this.dataService.downloadFiles();
  }

  downloadFiles() {
    this.dataService.downloadFiles();
  }

  openMovies() {
    if (!this.store.getState().movies.onboardingFinished) {
      this.navigateForward('movie-onboarding');
    } else {
      this.navigateForward('movies');
    }
  }

  async loadMap() {
    const location = await this.backgroundGeolocation.getCurrentLocation();
    let target = {
      lat: location.latitude,
      lng: location.longitude
    };
    if (this.locations.length > 0) {
      target = {
        lat: this.locations[0][0].latitude,
        lng: this.locations[0][0].longitude
      };
    }

    const mapOptions: GoogleMapOptions = {
      camera: {
        target,
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.addMarkers();
    this.mapLoaded = true;
  }

  addMarkers() {
    const markers = [];
    this.locations.forEach(peerLocations => {
      peerLocations.forEach(l => {
        markers.push({
          name: l.name,
          latitude: l.latitude,
          longitude: l.longitude,
          count: l.count,
          similarity: l.similarity
        });
      });
    });
    console.log('markers', markers);
    markers.forEach(location => {
      const marker: Marker = this.map.addMarkerSync({
        title: location.name,
        icon: 'blue',
        animation: 'DROP',
        snippet:
          'Hey, you`ve met this peer ' +
          location.count +
          ' times \nSimilarity-score: ' +
          (location.similarity * 100).toFixed(2) +
          '%',
        position: {
          lat: location.latitude,
          lng: location.longitude
        }
      });
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        marker.setTitle(marker.get('title'));
        marker.showInfoWindow();
      });
    });
  }

  async showErrorToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  navigateForward(route: string) {
    this.navCtrl.navigateForward(route);
  }
}
