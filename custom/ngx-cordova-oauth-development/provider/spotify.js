// Spotify web api authorization guide and scopes
// https://developer.spotify.com/web-api/authorization-guide
// https://developer.spotify.com/web-api/using-scopes/
import { OAuthProvider } from "../provider";
export class Spotify extends OAuthProvider {
    constructor() {
        super(...arguments);
        this.authUrl = 'https://accounts.spotify.com/authorize';
        this.APP_SCOPE_DELIMITER = ' ';
        this.defaults = {
            responseType: 'token'
        };
    }
}
