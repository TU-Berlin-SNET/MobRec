import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ToastController } from '@ionic/angular';
import { MovieActions } from '../../../store/movies/actions';
import { AppState } from '../../../store/store';
import { MovieRatingComponentComponent } from '../movie-rating-component/movie-rating-component.component';

@Component({
  selector: 'app-movie-detail-popover',
  templateUrl: './movie-detail-popover.component.html',
  styleUrls: ['./movie-detail-popover.component.scss']
})
export class MovieDetailPopoverComponent implements OnInit {
  movie;
  tvGenres;
  movieGenres;
  genres;
  type;
  inList;
  base;

  constructor(
    navParams: NavParams,
    private popoverController: PopoverController,
    private store: NgRedux<AppState>,
    private movieActions: MovieActions,
    private toastCtrl: ToastController
  ) {
    this.movie = navParams.get('message');
    this.movieGenres = navParams.get('movieGenres');
    this.tvGenres = navParams.get('tvGenres');
    this.type = navParams.get('type');
    this.base = navParams.get('base');
  }

  ngOnInit() {
    console.log(this.type);
    if (this.type === 'movie') {
      this.genres = this.movie.genre_ids
        .map(id => {
          return this.movieGenres.find(item => item.id === id).name;
        })
        .join(', ');
    }
    if (this.type === 'tv') {
      this.genres = this.movie.genre_ids
        .map(id => {
          return this.tvGenres.find(item => item.id === id).name;
        })
        .join(', ');
    }
    console.log(this.genres);
  }

  setNotInterested(movie) {
    const update = {
      ...movie,
      notInterested: movie.notInterested ? false : {
        base: this.base,
        timestamp: Date.now()
      }
    };
    let type = movie.type;
    if (!type) {
      type = movie.release_date ? 'movie' : 'tv';
    }
    this.movieActions.updateMovie(update, type);
    this.close();
  }

  async toggleAlreadySeen(event, movie) {
    const alreadySeen = movie.alreadySeen ? false : {
      base: this.base,
      timestamp: Date.now()
    };
    const update = {
      ...movie,
      alreadySeen
    };
    let type = movie.type;
    if (!type) {
      type = movie.release_date ? 'movie' : 'tv';
    }
    this.movieActions.updateMovie(update, type);
    this.movieActions.updateSearchMovie(update);
    this.movie.alreadySeen = update.alreadySeen;
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
    this.popoverController.dismiss();
    let popover = await this.popoverController.create({
      component: MovieRatingComponentComponent,
      translucent: true,
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: { movie, base: movie.from },
      event: ev
    });
    return await popover.present().then(() => (popover = null));
  }

  async toggleWatchList(movie) {
    let type = movie.type;
    if (!type) {
      type = movie.release_date ? 'movie' : 'tv';
    }
    const watchList = movie.watchList ? false : {
      base: this.base,
      timestamp: Date.now()
    };
    const update = {
      ...movie,
      watchList
    };
    this.movieActions.updateMovie(update, type);
    this.movieActions.updateSearchMovie(update);
    let message = 'Movie has been added to your watchlist';
    if (!update.watchList) {
      message = 'Movie has been removed from your watchlist';
    }
    this.movie.watchList = update.watchList;
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  close() {
    this.popoverController.dismiss();
  }
}
