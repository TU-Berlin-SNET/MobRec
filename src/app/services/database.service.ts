import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  options = {
    name: 'db.mobirec',
    androidDatabaseProvider: 'system',
    iosDatabaseLocation: 'Documents'
  };
  db: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
  }

  async addBatteryStatus(status, isPlugged) {
    const date = new Date().toString();
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      this.db.transaction((tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS BatteryStatus(id INTEGER PRIMARY KEY, status INTEGER NOT NULL
          , time VARCHAR, isPlugged INTEGER);`);
        tx.executeSql(`INSERT OR REPLACE into BatteryStatus (id, status, time, isPlugged) VALUES (?,?,?,?);`,
        [
          Date.now(),
          status,
          date,
          isPlugged ? 1 : 0
        ]);
      }).then(() => {
        console.log('yes');
      })
      .catch(e => console.log(e));
    } else {
      return Promise.resolve();
    }
  }

  async addMovieToDatabase(movieId, userId, rating): Promise<any> {
    const alreadySeen = rating.alreadySeen ? true : false;
    const watchList = rating.watchList ? true : false;
    const notInterested = rating.notInterested ? true : false;
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      this.db.transaction((tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS MovieRatings(movieId INTEGER PRIMARY KEY, UserId VARCHAR NOT NULL,
          alreadySeen INTEGER, watchList INTEGER, notInterested INTEGER, rating INTEGER, timestamp INTEGER);`);
        tx.executeSql(`INSERT OR REPLACE into MovieRatings (movieId, userId, alreadySeen, watchList,
          notInterested, rating, timestamp) VALUES (?,?,?,?,?,?,?);`,
        [
          movieId,
          userId,
          alreadySeen,
          watchList,
          notInterested,
          rating.rating,
          Date.now()
        ]);
      }).then(() => {
        console.log('yes');
      })
      .catch(e => console.log(e));
    } else {
      return Promise.resolve();
    }
  }

  async addMoviesFromNearbyToDatabase(movies, userId) {
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      const promises = movies.map(rating => {
        return  this.db.transaction((tx) => {
          tx.executeSql(`CREATE TABLE IF NOT EXISTS MovieRatings(movieId INTEGER PRIMARY KEY, UserId VARCHAR NOT NULL,
            alreadySeen INTEGER, watchList INTEGER, notInterested INTEGER, rating INTEGER, timestamp INTEGER);`);
          tx.executeSql( `INSERT OR REPLACE into MovieRatings (movieId, userId, alreadySeen, watchList,
            notInterested, rating, timestamp) VALUES (?,?,?,?,?,?,?);`,
            [
              rating.id,
              userId,
              rating.alreadySeen,
              rating.watchList,
              rating.notInterested,
              rating.rating,
              Date.now()
            ]);
        });
      });
      await Promise.all(promises);
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  async addLocation(userId, location) {
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      this.db.transaction((tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS Locations(id VARCHAR PRIMARY KEY, userId VARCHAR, latitude TEXT,
          longitude TEXT, timestamp INTEGER);`);
        tx.executeSql(`INSERT OR REPLACE into Locations (id, userId, latitude, longitude, timestamp) VALUES (?,?,?,?,?);`,
        [location.id, userId, location.latitude, location.longitude, location.time]);
      }).then(() => {
        console.log('yes');
      })
      .catch(e => console.log(e));
    } else {
      return Promise.resolve();
    }
  }

  async addTracksFromNearbyToDatabase(tracks, userId) {
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      const promises = tracks.map(track => {
        return this.db.transaction((tx) => {
          tx.executeSql(`CREATE TABLE IF NOT EXISTS MusicRatings(trackId VARCHAR PRIMARY KEY, UserId VARCHAR NOT NULL
            , timestamp INTEGER);`);
          tx.executeSql(`INSERT OR REPLACE into MusicRatings (trackId, userId, timestamp) VALUES (?,?,?);`,
          [track.id, userId, Date.now()]);
        });
      });
      await Promise.all(promises);
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  async addTrackToDatabase(trackId, userId): Promise<any> {
    if (window.cordova) {
      this.db = await this.sqlite.create(this.options);
      this.db.transaction((tx) => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS MusicRatings(trackId VARCHAR PRIMARY KEY, UserId VARCHAR NOT NULL
          , timestamp INTEGER);`);
        tx.executeSql(`INSERT OR REPLACE into MusicRatings (trackId, userId, timestamp) VALUES (?,?,?);`,
        [trackId, userId, Date.now()]);
      }).then(() => {
        console.log('yes');
      })
      .catch(e => console.log(e));
    } else {
      return Promise.resolve();
    }
  }
}
