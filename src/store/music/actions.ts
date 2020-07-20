import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicActions {
  static readonly UPDATE_RECENTLY_PLAYED = 'UPDATE_RECENTLY_PLAYED';
  static readonly UPDATE_TOP_TRACKS = 'UPDATE_TOP_TRACKS';
  static readonly UPDATE_NEARBY_TRACKS = 'UPDATE_NEARBY_TRACKS';
  static readonly UPDATE_TRACKS = 'UPDATE_TRACKS';
  static readonly UPDATE_SPOTIFY = 'UPDATE_SPOTIFY';

  constructor(
  ) {}

  @dispatch()
  updateTopTracks = (tracks) => ({
      type: MusicActions.UPDATE_TOP_TRACKS,
      payload: {
          tracks
      }
  });

  @dispatch()
  updateSpotify = () => ({
      type: MusicActions.UPDATE_SPOTIFY
  });

  @dispatch()
  updateTracksFromNearby = (tracks, peerId) => ({
      type: MusicActions.UPDATE_NEARBY_TRACKS,
      payload: {
          tracks,
          id: peerId
      }
  });

  @dispatch()
  updateRecentlyPlayed = (tracks) => ({
      type: MusicActions.UPDATE_RECENTLY_PLAYED,
      payload: {
          tracks
      }
  });

}
