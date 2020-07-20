import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieActions {
  static readonly MOVIE_REMOVED = 'MOVIE_REMOVED';
  static readonly RECOMMENDED_MOVIE_ADDED = 'RECOMMENDED_MOVIE_ADDED';
  static readonly UPDATE_RATING = 'UPDATE_RATING';
  static readonly RESET = 'RESET';
  static readonly UPDATE_SEARCH = 'UPDATE_SEARCH';
  static readonly UPDATE_SEARCH_MOVIE = 'UPDATE_SEARCH_MOVIE';
  static readonly UPDATE_MOVIE = 'UPDATE_MOVIE';
  static readonly SET_NOT_INTERESTED = 'SET_NOT_INTERESTED';
  static readonly UPDATE_MOVIE_GENRES = 'UPDATE_MOVIE_GENRES';
  static readonly UPDATE_TV_GENRES = 'UPDATE_TV_GENRES';
  static readonly ONBOARDING_FINISHED = 'ONBOARDING_FINISHED';
  static readonly UPDATE_NEARBY_MOVIES = 'UPDATE_NEARBY_MOVIES';

  constructor(
  ) {}


  @dispatch()
  setNotInterested = (movie, base) => ({
    type: MovieActions.SET_NOT_INTERESTED,
    payload: {
      movie,
      base
    }
  });

  @dispatch()
  finishOnboarding = () => ({
    type: MovieActions.ONBOARDING_FINISHED
  })

  @dispatch()
  updateNearbyMovies = (movies, peerId) => ({
    type: MovieActions.UPDATE_NEARBY_MOVIES,
    payload: {
      movies,
      id: peerId
    }
  })

  @dispatch()
  updateSearch = (results, value, type) => ({
    type: MovieActions.UPDATE_SEARCH,
    payload: {
      results,
      value,
      type
    }
  })

  @dispatch()
  updateSearchMovie = (movie) => ({
    type: MovieActions.UPDATE_SEARCH_MOVIE,
    payload: {
      movie
    }
  })

  @dispatch()
  updateMovieGenres = (genres) => ({
    type: MovieActions.UPDATE_MOVIE_GENRES,
    payload: {
      genres
    }
  })

  @dispatch()
  updateTVGenres = (genres) => ({
    type: MovieActions.UPDATE_TV_GENRES,
    payload: {
      genres
    }
  })

  @dispatch()
  updateMovie = (movie, type) => ({
    type: MovieActions.UPDATE_MOVIE,
    payload: {
      ...movie,
      type
    }
  })

  @dispatch()
  reset = () => ({
    type: MovieActions.RESET
  });

  @dispatch()
  updateRating = (movie, rating) => ({
    type: MovieActions.UPDATE_RATING,
    payload: {
      movie,
      rating
    }
  });

  @dispatch()
  movieRemoved = movie => ({
    type: MovieActions.MOVIE_REMOVED,
    payload: { movie }
  })
}
