import { Reducer } from 'redux';
import { Movies } from '../../app/models';
import { INITIAL_STATE } from '../reducers';
import { MovieActions } from './actions';

// tslint:disable-next-line: cyclomatic-complexity
export const moviesReducer: Reducer<Movies> = (
  state: Movies = INITIAL_STATE.movies,
  action
) => {
  switch (action.type) {

    case MovieActions.RESET:
      return INITIAL_STATE.movies;

    case MovieActions.UPDATE_SEARCH_MOVIE:
      {
        const search = state.search.find(movie => movie.id === action.payload.movie.id);
        if (search) {
          const index = state.search.indexOf(search);
          return {
            ...state,
            search: [
              ...state.search.slice(0, index),
              { ...action.payload.movie },
              ...state.search.slice(index + 1)
            ]
          };
        } else {
          return state;
        }
      }


    case MovieActions.UPDATE_SEARCH: {
      return {
        ...state,
        searchKey: action.payload.value,
        searchType: action.payload.type,
        search: action.payload.results.map(item => {
          const searchMovie = state.movies.find(movie => movie.id === item.id);
          if (!searchMovie) {
            return {
              title: item.title ? item.title : item.name,
              id: item.id,
              overview: item.overview,
              image: item.poster_path,
              date: item.release_date ? item.release_date : item.first_air_date,
              rating: 0,
              watchList: false,
              type: item.type
            };
          } else { return searchMovie; }
        })
      };
    }

    case MovieActions.UPDATE_MOVIE: {
      const movie = state.movies.find(item => item.id === action.payload.id)
      let date = action.payload.date;
      if (action.payload.first_air_date) {
        date = action.payload.first_air_date;
      } else if (action.payload.release_date) {
        date = action.payload.release_date;
      }
      if (!movie) {
        date = action.payload.date;
        if (action.payload.first_air_date) {
          date = action.payload.first_air_date;
        } else if (action.payload.release_date) {
          date = action.payload.release_date;
        }
        return {
          ...state,
          movies: [...state.movies, {
            title: action.payload.title ? action.payload.title : action.payload.name,
            id: action.payload.id,
            overview: action.payload.overview,
            image: action.payload.image ? action.payload.image : action.payload.poster_path,
            date,
            rating: action.payload.rating,
            watchList: action.payload.watchList,
            type: action.payload.type,
            notInterested: action.payload.notInterested,
            alreadySeen: action.payload.alreadySeen
          }]
        };
      } else {

        const index = state.movies.indexOf(movie);
        return {
          ...state,
          movies: [
            ...state.movies.slice(0, index),
            {
              title: action.payload.title ? action.payload.title : action.payload.name,
              id: action.payload.id,
              overview: action.payload.overview,
              image: action.payload.image ? action.payload.image : action.payload.poster_path,
              date,
              rating: action.payload.rating,
              watchList: action.payload.watchList,
              notInterested: action.payload.notInterested,
              type: action.payload.type,
              alreadySeen: action.payload.alreadySeen
            },
            ...state.movies.slice(index + 1)
          ]
        };
      }
    }

    case MovieActions.UPDATE_TV_GENRES:
      return {
        ...state,
        tvGenres: action.payload.genres
      };

    case MovieActions.UPDATE_MOVIE_GENRES:
      return {
        ...state,
        movieGenres: action.payload.genres
      };

    case MovieActions.ONBOARDING_FINISHED:
      return {
        ...state,
        onboardingFinished: true
      };

    case MovieActions.UPDATE_NEARBY_MOVIES: {
      let fromNearby = state.fromNearby.map(item => {
        return {
          ...item
        };
      });
      let nearbyMovies = [];
      action.payload.movies.forEach(movie => {
        const index = state.fromNearby.findIndex(item => item.id === movie.id);
        if (index !== -1) {
          const alreadyFound = state.fromNearby[index];
          let peerList = alreadyFound.peerList.map(item => ({ ...item }));
          const peerIndex = peerList.findIndex(item => item.id === action.payload.id);
          if (peerIndex !== -1) {
            peerList = [...peerList.slice(0, peerIndex),
            { rating: movie.rating, id: action.payload.id },
            ...peerList.slice(peerIndex + 1)];
          } else {
            peerList = [...peerList, { id: action.payload.id, rating: movie.rating }];
          }
          fromNearby = [
            ...fromNearby.slice(0, index),
            { ...alreadyFound, peerList },
            ...fromNearby.slice(index + 1)
          ];
        } else {
          nearbyMovies = [...nearbyMovies, {
            ...movie,
            peerList: [{ rating: movie.rating, id: action.payload.id }]
          }];
        }
      });
      return {
        ...state,
        fromNearby: [...fromNearby, ...nearbyMovies]
      };
    }

    case MovieActions.UPDATE_RATING: {
      const index = state.movies.indexOf(action.payload.movie);
      const newState = state.movies.map((item, i) => {
        if (i !== index) {
          return { ...item };
        } else {
          return {
            ...item,
            rating: action.payload.rating
          };
        }
      });
      return {
        ...state,
        movies: [...newState]
      };
    }

    default:
      return state;
  }
};
