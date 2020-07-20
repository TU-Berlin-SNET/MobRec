import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationActions {

  static readonly LOCATION_ADDED = 'LOCATION_ADDED';

  constructor(
  ) {}


  @dispatch()
  addLocation = (location) => ({
      type: LocationActions.LOCATION_ADDED,
      payload: {
          location
      }
  });

}
