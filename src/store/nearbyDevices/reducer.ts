import { Reducer } from 'redux';
import { NearbyDevices } from '../../app/models';
import { INITIAL_STATE } from '../reducers';
import { NearbyDevicesActions } from './actions';

// export interface NearbyDevices {
//     nearbyPeers: Peer []
// }

// export interface Peer {
//     urlKey: string,
//     lastMet: number,
//     meetingPoints: Location[],
//     count: number,
//     retrieved: boolean | number
// }

export const nearbyDevicesReducer: Reducer<NearbyDevices> = (
  state: NearbyDevices = INITIAL_STATE.nearbyDevices,
  action
) => {
  switch (action.type) {
    case NearbyDevicesActions.KEY_FOUND:
      // TODO check last update of keys
      const peerIndex = state.nearbyPeers.findIndex(
        item => item.urlKey === action.payload.urlKey
      );
      if (peerIndex === -1) {
        const count = 0;
        const lastMet = action.payload.timestamp;
        const retrieved = false;
        return {
          ...state,
          nearbyPeers: [
            ...state.nearbyPeers,
            {
              urlKey: action.payload.urlKey,
              count,
              lastMet: [lastMet],
              retrieved,
              countMin: action.payload.countMin,
              meetingPoints: [action.payload.location],
              similarity: action.payload.similarity,
              id: action.payload.id
            }
          ]
        };
      } else {
        const peer = state.nearbyPeers[peerIndex];
        const count = peer.count + 1;
        const meetingPoints = [...peer.meetingPoints, action.payload.location];
        return {
          ...state,
          nearbyPeers: [
            ...state.nearbyPeers.slice(0, peerIndex),
            {
              ...peer,
              count,
              lastMet: [...peer.lastMet, action.payload.timestamp],
              retrieved: false,
              meetingPoints,
              countMin: action.payload.countMin,
              similarity: action.payload.similarity
            },
            ...state.nearbyPeers.slice(peerIndex + 1)
          ]
        };
      }

    case NearbyDevicesActions.RETRIEVED:
      const index = state.nearbyPeers.findIndex(
        item => item.urlKey === action.payload.peer.urlKey
      );
      if (index === -1) {
        return state;
      } else {
        const peer = { ...state.nearbyPeers[index] };
        return {
          ...state,
          nearbyPeers: [
            ...state.nearbyPeers.slice(0, index),
            { ...peer, retrieved: Date.now() },
            ...state.nearbyPeers.slice(index + 1)
          ]
        };
      }

    case NearbyDevicesActions.RESET_KEYS:
      return {
        ...state,
        nearbyPeers: []
      };

    default:
      return state;
  }
};
