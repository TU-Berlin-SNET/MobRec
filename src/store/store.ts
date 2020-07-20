import * as localForage from 'localforage';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import reduxFreeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import {
  Locations,
  Movies,
  Music,
  NearbyDevices,
  Profile
} from '../app/models';
import { rootReducer } from './reducers';
import FileStorage from './redux-persist-file-storage';

export interface AppState {
  profile: Profile;
  movies: Movies;
  nearbyDevices: NearbyDevices;
  music: Music;
  locations: Locations;
}

declare var window: any;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig: PersistConfig = {
  key: 'root',
  storage: (window as any).cordova ? FileStorage : localForage,
  timeout: null
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: Store<AppState> = createStore(
  persistedReducer,
  applyMiddleware(thunk, createLogger(), reduxFreeze)
);

export const persistor = persistStore(store);
