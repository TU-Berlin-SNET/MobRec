import { Reducer } from 'redux';
import { Music } from '../../app/models';
import { INITIAL_STATE } from '../reducers';
import { MusicActions } from './actions';

export const musicReducer: Reducer<Music> = (
  state: Music = INITIAL_STATE.music,
  action
) => {
  switch (action.type) {
    case MusicActions.UPDATE_NEARBY_TRACKS: {
      let fromNearby = state.fromNearby.map(item => {
        return {
          ...item
        };
      });
      let nearbyTracks = [];
      action.payload.tracks.forEach(track => {
        const index = state.fromNearby.findIndex(item => item.id === track.id);
        if (index !== -1) {
          const alreadyFound = state.fromNearby[index];
          let peerList = alreadyFound.peerList.map(item => ({ ...item }));
          const peerIndex = peerList.findIndex(
            item => item.id === action.payload.id
          );
          if (peerIndex !== -1) {
            peerList = [
              ...peerList.slice(0, peerIndex),
              { id: action.payload.id },
              ...peerList.slice(peerIndex + 1)
            ];
          } else {
            peerList = [...peerList, { id: action.payload.id }];
          }
          fromNearby = [
            ...fromNearby.slice(0, index),
            { ...alreadyFound, peerList },
            ...fromNearby.slice(index + 1)
          ];
        } else {
          nearbyTracks = [
            ...nearbyTracks,
            {
              ...track,
              peerList: [{ id: action.payload.id }]
            }
          ];
        }
      });
      return {
        ...state,
        fromNearby: [...fromNearby, ...nearbyTracks]
      };
    }

    case MusicActions.UPDATE_TOP_TRACKS: {
      const tracks = action.payload.tracks.items.map(item => {
        if (item.name) {
          return {
            addedAt: Date.now(),
            name: item.name,
            id: item.id,
            image: item.album.images[0].url,
            url: item.external_urls.spotify
          };
        }
      });
      return {
        ...state,
        top: tracks
      };
    }

    case MusicActions.UPDATE_SPOTIFY: {
      const spotify = !state.spotify;
      return {
        ...state,
        spotify
      };
    }

    case MusicActions.UPDATE_RECENTLY_PLAYED: {
      let recentlyPlayed = state.recentlyPlayed.map(item => ({ ...item }));
      action.payload.tracks.items.forEach(item => {
        if (item.track) {
          const track = {
            addedAt: Date.now(),
            name: item.track.name,
            id: item.track.id,
            image: item.track.album.images[0].url,
            url: item.track.external_urls.spotify
          };
          const recentIndex = recentlyPlayed.findIndex(
            recentItem => recentItem.id === track.id
          );
          if (recentIndex !== -1) {
            recentlyPlayed = [
              ...recentlyPlayed.slice(0, recentIndex),
              { ...track },
              ...recentlyPlayed.slice(recentIndex + 1)
            ];
          } else {
            recentlyPlayed = [...recentlyPlayed, track];
          }
        }
      });
      return {
        ...state,
        recentlyPlayed
      };
    }
    default:
      return state;
  }
};
