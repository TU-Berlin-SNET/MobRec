import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Slides } from '@ionic/angular';
import { MovieActions } from '../../../store/movies/actions';
import { DatabaseService } from '../../services/database.service';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../../store/store';

const TMDB_KEY = 'INSERT_KEY';

@Component({
  selector: 'app-movie-onboarding',
  templateUrl: './movie-onboarding.page.html',
  styleUrls: ['./movie-onboarding.page.scss'],
})
export class MovieOnboardingPage implements OnInit {
  @ViewChild(Slides) slider: Slides;
  @Input() modal: any;
  movieGenres;
  tvGenres;
  movies;
  type;
  activeIndex = 0;
  slides = [
    {
      title: 'Choose your favorite genres for movies',
      type: 'movieGenre',
      image: null,
      id: null
    },
    {
      title: 'Choose your favorite genres for tv shows',
      type: 'tvGenre',
      image: null,
      id: null,
      overview: null,
      date: null,
      rating: null
    }
  ];
  slideOpts = {
    effect: 'fade',
    slidesPerView: 1,
    allowUserZoom: false,
    zoom: {
      enabled: false
    }
  };
  slidesReady = false;

  constructor(private http: HttpClient, private movieActions: MovieActions,
    private modalController: ModalController, private nav: NavController, private router: Router, private dbService: DatabaseService,
    private store: NgRedux<AppState>) { }

  ngOnInit() {

    this.http.get('https://api.themoviedb.org/3/genre/movie/list?api_key=' + TMDB_KEY).subscribe(data => {
      this.movieGenres = (data as any).genres;
      console.log(data);
    });
    this.http.get('https://api.themoviedb.org/3/genre/tv/list?api_key=' + TMDB_KEY).subscribe(data => {
      this.tvGenres = (data as any).genres;
      console.log(data);
    });
    this.http.get('https://api.themoviedb.org/3/trending/tv/week?api_key=' + TMDB_KEY).subscribe(data => {
      const tv = (data as any).results.splice(0, 5);
      tv.forEach(item => {
        this.slides.push({
          type: 'tv',
          title: item.name,
          image: item.poster_path,
          id: item.id,
          overview: item.overview,
          date: item.first_air_date,
          rating: 0
        });
      });
      this.http.get('https://api.themoviedb.org/3/movie/popular?api_key=' + TMDB_KEY).subscribe(d => {
        const movies = (d as any).results.splice(0, 5);
        movies.forEach(item => {
          this.slides.push({
            type: 'movie',
            title: item.title,
            image: item.poster_path,
            id: item.id,
            overview: item.overview,
            date: item.release_date,
            rating: 0
          });
        });
        this.slides.sort(() => Math.random() - 0.5);
        this.type = this.slides[0].type;
        this.slidesReady = true;
        this.slider.lockSwipeToNext(true);
        this.slider.lockSwipeToPrev(true);
        console.log(this.slides);
      });
    });
  }

  onRatingChange(event, movie) {
    this.movieActions.updateMovie({
      ...movie,
      rating: event,
      watchList: false
    }, movie.type);
    const profile = this.store.getState().profile;
    this.dbService.addMovieToDatabase(movie.id, profile.id, event);
    this.continue();
  }

  toggleTvGenre(index) {
    const genre = this.tvGenres[index];
    this.tvGenres[index] = {
      ...genre,
      like: !genre.like
    };
  }

  toggleMovieGenre(index) {
    const genre = this.movieGenres[index];
    this.movieGenres[index] = {
      ...genre,
      like: !genre.like
    };
  }

  close() {
    this.nav.goBack();
  }

  updateGenres(type) {
    if (type === 'tvGenre') {
      this.movieActions.updateTVGenres(this.tvGenres.filter(item => item.like));
    } else if (type === 'movieGenre') {
      this.movieActions.updateMovieGenres(this.movieGenres.filter(item => item.like));
    }
    this.continue();
  }


  async continue() {
    if (this.activeIndex < this.slides.length - 1) {
      this.type = this.slides[this.activeIndex + 1].type;
      this.activeIndex++;
      this.slider.lockSwipeToNext(false);
      this.slider.slideNext();
      this.slider.lockSwipeToNext(true);
    } else {
      console.log(this.nav);
      this.movieActions.finishOnboarding();
      this.nav.goBack();
    }
  }
}
