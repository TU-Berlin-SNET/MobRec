import 'whatwg-fetch';
/**
 * The local storage key where the auth data is cached.
 *
 * The data is stored as stringified JSON object.
 */
export declare const LOCAL_STORAGE_KEY = "SpotifyOAuthData";
/**
 * The authorization data.
 */
export interface AuthorizationData {
    /** A valid access token. */
    accessToken: string;
    /** The encrypted refresh token. */
    encryptedRefreshToken: string;
    /** The date (from UTC, in milliseconds) when the given access token expires. */
    expiresAt: number;
}
/**
 * OAuth configuration data.
 */
export interface Config {
    /** The client ID as per the Spotify dev console. */
    clientId: string;
    /** The redirect URI as entered in the Spotify dev console. */
    redirectUrl: string;
    /**
     * Safety margin time (in milliseconds) for the token refresh.
     *
     * The plugin applies a safety margin to the token lifetime in order
     * to give the token user enough time to perform all operations needed.
     *
     * Otherwise the plugin might hand out a token that is already expired
     * before it could ever be used.
     *
     * The safety margin defaults to 30s.
     */
    refreshSafetyMargin?: number;
    /** Requested OAuth scopes. */
    scopes: string[];
    /** The token exchange URL. */
    tokenExchangeUrl: string;
    /** The token refresh URL. */
    tokenRefreshUrl: string;
}
/**
 * Obtains valid authorization data.
 *
 * This method performs the necessary steps in order to obtain a valid
 * access token. It performs the OAuth dance prompting the user to log in,
 * exchanges the obtained authorization code for an access and a refresh
 * token, caches those, and returns both to the developer.
 *
 * When it is invoked again, it will first check whether the cached access
 * token is still valid (including a configurable safety margin) and the
 * scopes equal, and return the token directly if that is the case. Otherwise,
 * the method will transparently refresh the token (or obtain a new one if
 * the scopes changed) and return that.
 *
 * Bottom line - always call this if you need a valid access token in your code.
 *
 * @param cfg OAuth configuration
 */
export declare function authorize(cfg: Config): Promise<AuthorizationData>;
/**
 * Removes all cached data so that `authorize` performs the full
 * oauth dance again.
 *
 * This is akin to a "logout".
 */
export declare function forget(): void;
