import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Profile } from '../../app/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileActions {
  static readonly GOOGLE_AUTH = 'GOOGLE_AUTH';
  static readonly SPOTIFY_CONNECTED = 'SPOTIFY_CONNECTED';
  static readonly FORGET_GOOGLE = 'FORGET_GOOGLE';
  static readonly FORGET_SPOTIFY = 'FORGET_SPOTIFY';
  static readonly UPDATE_SHORT_URL = 'UPDATE_SHORT_URL';
  static readonly UPDATE_CLOUD_ID = 'UPDATE_CLOUD_ID';
  static readonly UPDATE_WEBCONTENT_LINK = 'UDATE_WEBCONTENT_LINK';
  static readonly UPDATE_SETTINGS = 'UPDATE_SETTINGS';

  constructor(
  ) {}

  @dispatch()
  googleAuth = (authData) => ({
    type: ProfileActions.GOOGLE_AUTH,
    payload: authData
  });

  @dispatch()
  updateShortUrl = (key, id) => ({
    type: ProfileActions.UPDATE_SHORT_URL,
    payload: {
      key,
      id
    }
  })

  @dispatch()
  updateCloudProviderId = (id) => ({
    type: ProfileActions.UPDATE_CLOUD_ID,
    payload: {
      id
    }
  })

  @dispatch()
  updateSettings = (values) => ({
    type: ProfileActions.UPDATE_SETTINGS,
    payload: {
      values
    }
  });

  @dispatch()
  resetGoogle = () => ({
    type: ProfileActions.FORGET_GOOGLE
  });

  @dispatch()
  updateWebContentLink = (url) => ({
    type: ProfileActions.UPDATE_WEBCONTENT_LINK,
    payload: {
      url
    }
  });

}
