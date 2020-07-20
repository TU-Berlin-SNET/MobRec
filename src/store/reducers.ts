import { CountMinSketch } from 'bloom-filters';
import { combineReducers, Reducer } from 'redux';
import { locationReducer } from './location/reducer';
import { moviesReducer } from './movies/reducer';
import { musicReducer } from './music/reducer';
import { nearbyDevicesReducer } from './nearbyDevices/reducer';
import { profileReducer } from './profile/reducer';
import { AppState } from './store';

export interface Link {
  urlKey: string;
  timestamp: string;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable-next-line: one-variable-per-declaration
    // tslint:disable-next-line: no-bitwise
    const r = (Math.random() * 16) | 0;
    // tslint:disable-next-line: no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const INITIAL_STATE: AppState = {
  profile: {
    id: uuidv4(),
    googleAuth: null,
    shortUrlId: null,
    shortUrlKey: null,
    cloudProviderId: null,
    lastUpdated: null,
    webContentLink: null,
    nickname: '',
    sendNickname: true,
    sendMovies: true,
    sendMusic: true,
    sendSimilarity: true,
    startTime: null
  },
  movies: {
    movies: [],
    fromNearby: [],
    tvGenres: [],
    movieGenres: [],
    search: [],
    searchKey: '',
    searchType: '',
    onboardingFinished: false
  },
  nearbyDevices: {
    nearbyPeers: []
  },
  music: {
    top: [],
    recentlyPlayed: [],
    fromNearby: [],
    spotify: false
  },
  locations: {
    locations: [],
    countMin: new CountMinSketch(0.001, 0.9)
  }
};

export const rootReducer: Reducer<AppState> = combineReducers({
  profile: profileReducer,
  movies: moviesReducer,
  nearbyDevices: nearbyDevicesReducer,
  music: musicReducer,
  locations: locationReducer
});
