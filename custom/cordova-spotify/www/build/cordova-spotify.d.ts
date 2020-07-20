import { EventEmitter as Emitter } from 'eventemitter3';
/**
 * Authorization data for the Spotify API.
 *
 * @see [cordova-spotify-oauth]{@link https://github.com/Festify/cordova-spotify-oauth}
 */
export interface AuthorizationData {
    /** The client ID for which the token is valid. */
    clientId: string;
    /**
     * The valid access token with `streaming` scope.
     *
     * You can use the [cordova-spotify-oauth]{@link https://github.com/Festify/cordova-spotify-oauth}
     * plugin for authentication.
     */
    token: string;
}
/**
 * Plays a track by its URI.
 *
 * When `positionMs` is < 0, this function immediately throws an error
 * instead of returning a rejected promise.
 *
 * `auth` may change freely during runtime. The plugin will handle the
 * required login / logout processes automatically when a new track is played.
 *
 * @param {string} trackUri The URI of the track to play.
 * @param {AuthorizationData} auth Valid authorization data.
 * @param {number} positionMs The position (in millseconds) to start playing from. Must be >= 0.
 * @returns {Promise<void>} A promise that resolves when the track starts playing.
 * @async
 */
export declare function play(trackUri: string, auth: AuthorizationData, positionMs?: number): Promise<void>;
/**
 * Obtains the playback position in milliseconds.
 *
 * If no track is currently loaded / playing, the function returns 0.
 *
 * @returns {Promise<number>} A promise with the playback position.
 * @async
 */
export declare function getPosition(): Promise<number>;
/**
 * Pauses playback.
 *
 * If no track is currently loaded / playing, this function does nothing.
 *
 * @returns {Promise<void>} A promise that resolves when the playback has been paused.
 * @async
 */
export declare function pause(): Promise<void>;
/**
 * Resumes playback.
 *
 * If no track is currently loaded / playing, this function returns
 * a rejected Promise with an error of type `not_playing`.
 *
 * @returns {Promise<void>} A promise that resolves when the playback has been resumed.
 * @async
 */
export declare function resume(): Promise<void>;
/**
 * Seeks to the given position in the current track.
 *
 * If no track is currently loaded / playing, this function returns
 * a rejected Promise with an error of type `not_playing`.
 *
 * When `positionMs` is < 0, this function immediately throws an error
 * instead of returning a rejected promise.
 *
 * @param {number} positionMs The position (in millseconds) to seek to. Must be >= 0.
 * @returns {Promise<void>} A promise that resolves when the seek has been done.
 * @async
 */
export declare function seekTo(positionMs: number): Promise<void>;
/**
 * Obtains an event emitter that relays the events fired by the native SDKs.
 *
 * The emitter will be created once and then returned on subsequent invocations.
 * The emitter implementation comes from [eventemitter3]{@link https://github.com/primus/eventemitter3}.
 *
 * The emitted events are the following:
 * - connectionmessage
 * - loggedin
 * - loggedout
 * - loginfailed
 * - playbackerror
 * - playbackevent
 * - temporaryerror
 *
 * In the case of `loginfailed`, `playbackevent` and `playbackerror`, the event contains
 * a payload that describes what happened exactly. The payload is simply the name
 * of the discriminant of the enum in the native SDK without the prefix (usually
 * `kSp` or `kSpError`). See the offical documentation [here]{@link https://spotify.github.io/android-sdk/player/com/spotify/sdk/android/player/Error.html}
 * and [here]{@link https://spotify.github.io/android-sdk/player/com/spotify/sdk/android/player/PlayerEvent.html}
 * for all variants.
 *
 * @returns {Promise<EventEmitter>} A promise that resolves to the emitter.
 * @async
 */
export declare function getEventEmitter(): Promise<Emitter>;
