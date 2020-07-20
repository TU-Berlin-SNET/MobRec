import { CountMinSketch } from 'bloom-filters';
import Geohash from 'latlon-geohash';
import * as _ from 'lodash';
import { Reducer } from 'redux';
import { Locations } from '../../app/models';
import { INITIAL_STATE } from '../reducers';
import { LocationActions } from './actions';

export const locationReducer: Reducer<Locations> = (
  state: Locations = INITIAL_STATE.locations,
  action
) => {
  switch (action.type) {
    case LocationActions.LOCATION_ADDED:
      const countMin = new CountMinSketch(0.001, 0.9);
      const location = action.payload.location;
      const geohash = Geohash.encode(location.latitude, location.longitude, 6);
      if (state.countMin) {
        countMin._matrix = _.cloneDeep(state.countMin._matrix);
        countMin._seed = state.countMin._seed;
      }
      countMin.update(geohash);
      countMin.update('test');
      console.log('count: ', countMin.count('test'));
      console.log('count: ', countMin.count(geohash));
      return {
        countMin,
        locations: [...state.locations, action.payload.location]
      };

    default:
      return state;
  }
};
