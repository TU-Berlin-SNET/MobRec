import { NgRedux, select } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  NavController,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MovieActions } from '../../../store/movies/actions';
import { AppState } from '../../../store/store';
import { MovieDetailPopoverComponent } from '../../components/movie-detail-popover/movie-detail-popover.component';
import { Movies } from '../../models';
import { DatabaseService } from '../../services/database.service';

const TMDB_KEY = 'INSERT_KEY';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss']
})
export class MoviesPage implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl('', [Validators.required])
  });
  results = [];

  @select(['movies'])
  readonly movies$: Observable<Movies>;
  movies;

  @select(['movies', 'search'])
  readonly search$: Observable<Movies>;

  recommendedMovies = [];

  destroy$ = new Subject<void>();
  activeSegment = 'discover';
  slideOpts;
  type = 'movie';
  movieGenres = [];
  tvGenres = [];
  favorites;
  watchlist;
  notInterested;

  constructor(
    private http: HttpClient,
    private movieActions: MovieActions,
    private toastCtrl: ToastController,
    private cf: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private store: NgRedux<AppState>,
    private popoverController: PopoverController,
    private nav: NavController,
    private dbService: DatabaseService
  ) {}

  async ngOnInit() {
    this.slideOpts = {
      effect: 'fade',
      slidesPerView: 4,
      allowUserZoom: false,
      zoom: {
        enabled: false
      }
    };
    this.movies$.pipe(takeUntil(this.destroy$)).subscribe(movies => {
      this.movies = movies.movies;
      this.favorites = movies.movies.filter(item => item.rating);
      this.watchlist = movies.movies.filter(item => item.watchList);
      this.results = movies.search;
      if (movies.searchKey !== '') {
        this.searchForm.controls['search'].setValue(movies.searchKey);
        this.type = movies.searchType;
      }
    });

    this.http
      .get('https://api.themoviedb.org/3/genre/movie/list?api_key=' + TMDB_KEY)
      .subscribe(data => {
        this.movieGenres = (data as any).genres;
        console.log(data);
      });
    this.http
      .get('https://api.themoviedb.org/3/genre/tv/list?api_key=' + TMDB_KEY)
      .subscribe(data => {
        this.tvGenres = (data as any).genres;
        console.log(data);
      });
    await this.getRecommendations();
    this.getNearbyRecommendations();
  }

  onRatingChange(event, movie) {
    console.log(event);
    const update = {
      ...movie,
      rating: event,
      type: this.type
    };
    this.movieActions.updateMovie(update, movie.type);
    this.addMovieToDatabase(update);
    this.movieActions.updateSearchMovie(update);
  }

  addMovieToDatabase(movie) {
    const rating = {
      rating: movie.rating,
      notInterested: movie.notInterested ? movie.notInterested : false,
      alreadySeen: movie.alreadySeen ? movie.alreadySeen : false,
      watchList: movie.watchList ? movie.watchList : false
    };
    const user = this.store.getState().profile;
    this.dbService.addMovieToDatabase(movie.id, user.id, rating);
  }

  discover() {
    this.http
      .get('https://api.themoviedb.org/3/tv/top_rated?api_key=' + TMDB_KEY)
      .subscribe(data => {
        console.log(data);
        this.results = (data as any).results;
      });
  }

  getRecommendations(): Promise<any> {
    this.recommendedMovies = [];
    const movies = this.store
      .getState()
      .movies.movies.filter(movie => movie.rating >= 3);
    movies.forEach(movie => {
      this.http
        .get(
          'https://api.themoviedb.org/3/' +
            movie.type +
            '/' +
            movie.id +
            '/recommendations?api_key=' +
            TMDB_KEY
        )
        .subscribe(data => {
          console.log(data);
          const from = movie.title;
          const results = (data as any).results;
          const filtered = results.filter(item => {
            const index = this.movies.findIndex(f => f.id === item.id && f.notInterested);
            return index === -1;
          });
          console.log(filtered);
          this.recommendedMovies.push({
            results: filtered,
            from,
            base: movie.id,
            type: movie.type
          });
        });
    });
    this.recommendedMovies.filter(movie => !movie.alreadySeen);
    return Promise.resolve();
  }

  async getNearbyRecommendations() {
    const movies = this.store.getState().movies.fromNearby;
    movies.forEach(movie => {
      this.http
        .get(
          'https://api.themoviedb.org/3/' +
            movie.type +
            '/' +
            movie.id +
            '/recommendations?api_key=' +
            TMDB_KEY
        )
        .subscribe(data => {
          console.log(data);
          const from = movie.title;
          const results = (data as any).results;
          const filtered = results.filter(item => {
            const index = this.movies.findIndex(f => f.id === item.id && f.notInterested);
            return index === -1;
          });
          console.log(filtered);
          this.recommendedMovies.push({
            results: filtered,
            from,
            base: movie.id,
            fromNearby: true,
            type: movie.type
          });
        });
    });
  }

  async toggleWatchList(movie) {
    const watchList = movie.watchList ? false : Date.now();
    const update = {
      ...movie,
      watchList
    };
    this.movieActions.updateMovie(update, this.type);
    this.addMovieToDatabase(update);
    this.movieActions.updateSearchMovie(update);
    let message = 'Movie has been added to your watchlist';
    if (!update.watchList) {
      message = 'Movie has been removed from your watchlist';
    }
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  filterRecommendations() {
    this.recommendedMovies = this.recommendedMovies.map(movies => {
      const filtered = movies.results.filter(item => {
        const index = this.movies.findIndex(f => f.id === item.id && f.notInterested);
        return index === -1;
      });
      console.log(filtered);
      return {
        ...movies,
        results: filtered
      };
    });
  }

  async presentPopover(event: any, movie, type, base) {
    const ev = {
      ...event,
      target: {
        getBoundingClientRect: () => {
          return {
            top: 100
          };
        }
      }
    };

    let popover = await this.popoverController.create({
      component: MovieDetailPopoverComponent,
      translucent: true,
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: {
        movie,
        movieGenres: this.movieGenres,
        tvGenres: this.tvGenres,
        type,
        base
      },
      event: ev
    });
    popover.onDidDismiss().then(async () => {
      await this.getRecommendations();
      this.filterRecommendations();
    });
    return await popover.present().then(() => {
      popover = null;
    });
  }

  typeChanged(ev) {
    this.type = ev.detail.value;
  }

  search() {
    this.movieActions.updateSearch([], '', '');
    const value = this.searchForm.controls['search'].value;

    this.http
      .get(
        'https://api.themoviedb.org/3/search/' +
          this.type +
          '?api_key=' +
          TMDB_KEY +
          '&query=' +
          value
      )
      .subscribe(data => {
        console.log(data);
        this.movieActions.updateSearch((data as any).results, value, this.type);
        this.cf.detectChanges();
      });
  }

  async onSegmentChange(segment) {
    this.cf.detectChanges();
    if (this.activeSegment === 'discover') {
      await this.getRecommendations();
      this.getNearbyRecommendations();
    }
  }

  async clearRating(movie) {
    const alert = await this.alertCtrl.create({
      header: 'Delete movie',
      message: 'Are you sure you want to clear your rating?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            const newMovie = {
              ...movie,
              rating: 0
            };
            this.movieActions.updateMovie(newMovie, this.type);
            this.addMovieToDatabase(newMovie);
            this.movieActions.updateSearchMovie(newMovie);
            const toast = await this.toastCtrl.create({
              message: 'Your rating has been cleared',
              duration: 2000,
              position: 'middle'
            });
            toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  async addMovie(rating, movie) {
    const newMovie = {
      ...movie,
      rating
    };
    this.movieActions.updateMovie(newMovie, this.type);
    this.addMovieToDatabase(newMovie);
    this.movieActions.updateSearchMovie(newMovie);
    const toast = await this.toastCtrl.create({
      message: 'Movie has been added to your saved movies',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
