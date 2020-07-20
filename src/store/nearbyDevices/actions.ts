import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NearbyDevicesActions {
  static readonly KEY_FOUND = 'KEY_FOUND';
  static readonly UPDATE_KEY = 'UPDATE_KEY';
  static readonly RESET_KEYS = 'RESET_KEYS';
  static readonly RETRIEVED = 'RETRIEVED';

  constructor(
  ) {}


  @dispatch()
  setRetrieved = (peer) => ({
    type: NearbyDevicesActions.RETRIEVED,
    payload: {
      peer
    }
  })

  @dispatch()
  resetFoundKeys = () => ({
    type: NearbyDevicesActions.RESET_KEYS
  })

  @dispatch()
  addOrUpdatePeer = (peer, similarity) => ({
    type: NearbyDevicesActions.KEY_FOUND,
    payload: {
      ...peer,
      similarity
    }
  });
}
