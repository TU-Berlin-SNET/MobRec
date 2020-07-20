import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { CountMinSketch } from 'bloom-filters';
import Geohash from 'latlon-geohash';
import { NearbyDevicesActions } from '../../store/nearbyDevices/actions';
import { AppState } from '../../store/store';


@Injectable({
  providedIn: 'root'
})
export class SimilarityService {

  constructor(private store: NgRedux<AppState>, private nearbyActions: NearbyDevicesActions) { }

  createCountMinSketch() {
    const sketch = new CountMinSketch(0.001, 0.9);
    const ownLocations = this.store.getState().locations;
    ownLocations.locations.forEach(location => {
      const geohash = Geohash.encode(location.latitude, location.longitude, 7);
      sketch.update(geohash);
    });
  }

  calculateSimilarity(matrix1, matrix2) {
    let dice = 0;
    let enumerator = 0;
    let denuminator = 0;
    // tslint:disable-next-line: forin
    for (const i in matrix1) {
      const row1 = matrix1[i];
      const row2 = matrix2[i];
      // tslint:disable-next-line: forin
      for (const j in row1) {
        enumerator += Math.min(row1[j], row2[j]);
        denuminator += row1[j] + row2[j];
      }
    }
    dice = (1 / matrix1.length) * ((2 * enumerator) / denuminator);
    console.log('similarity: ', dice);
    return dice;
  }
}
