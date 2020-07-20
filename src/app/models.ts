import { CountMinSketch } from 'bloom-filters';

export interface Profile {
  id: string;
  googleAuth: {
    token: string;
    refreshToken: string;
  };
  shortUrlKey: string;
  shortUrlId: string;
  cloudProviderId: string;
  lastUpdated: number;
  webContentLink: string;
  nickname: string;
  sendNickname: boolean;
  sendMovies: boolean;
  sendMusic: boolean;
  sendSimilarity: boolean;
  startTime: Date;
}

export interface Locations {
  locations: Location[];
  countMin: CountMinSketch;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  provider: string;
  time: number;
}

export interface Movies {
  movies: Movie[];
  fromNearby: NearbyMovie[];
  movieGenres: [];
  tvGenres: [];
  search: Movie[];
  searchKey: string;
  searchType: string;
  onboardingFinished: boolean;
}

export interface Music {
  top: Track[];
  recentlyPlayed: Track[];
  fromNearby: NearbyTrack[];
  spotify: boolean;
}

export interface Artist {
  name: string;
  id: string;
}

export interface Track {
  name: string;
  id: string;
  url: string;
  image: string;
  addedAt: number;
}

export interface NearbyRating {
  rating?: number;
  id: string;
}

export interface NearbyTrack extends Track {
  peerList: NearbyRating[];
}

export interface Rating {
  rating: number;
  timestamp: number;
}

export interface MovieReaction {
  base: string;
  timestamp: number;
}

export interface Movie {
  title: string;
  date: string;
  type: string;
  id: string;
  image: string;
  rating: number;
  overview: string;
  notInterested: boolean | MovieReaction;
  alreadySeen: boolean | MovieReaction;
  watchList: boolean | MovieReaction;
}

export interface NearbyMovie extends Movie {
  peerList: NearbyRating[];
}

export interface NearbyDevices {
  nearbyPeers: Peer[];
}

export interface Peer {
  id: string;
  urlKey: string;
  lastMet: string [];
  countMin: [];
  meetingPoints: Location[];
  count: number;

  similarity: number;
  retrieved: boolean | number;
}
