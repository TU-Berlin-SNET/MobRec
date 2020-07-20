import { Reducer } from 'redux';
import { Profile } from '../../app/models';
import { INITIAL_STATE } from '../reducers';
import { ProfileActions } from './actions';

export const profileReducer: Reducer<Profile> = (
  state: Profile = INITIAL_STATE.profile,
  action
) => {
  switch (action.type) {
    case ProfileActions.GOOGLE_AUTH:
      return {
        ...state,
        googleAuth: {
          token: action.payload.token,
          refreshToken: action.payload.refreshToken ? action.payload.refreshToken : state.googleAuth.refreshToken
        }
      };

    case ProfileActions.FORGET_GOOGLE:
      return {
        ...state,
        googleAuth: null
      };

    case ProfileActions.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload.values
      };
    case ProfileActions.UPDATE_CLOUD_ID:
      return {
        ...state,
        cloudProviderId: action.payload.id
      };

    case ProfileActions.UPDATE_WEBCONTENT_LINK:
      return {
        ...state,
        webContentLink: action.payload.url
      };

    case ProfileActions.UPDATE_SHORT_URL:
      return {
        ...state,
        shortUrlId: action.payload.id,
        shortUrlKey: action.payload.key
      };

    default:
      return state;
  }
};
