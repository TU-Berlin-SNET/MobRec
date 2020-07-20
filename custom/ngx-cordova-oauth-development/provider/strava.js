import { OAuthProvider } from "../provider";
export class Strava extends OAuthProvider {
    constructor() {
        super(...arguments);
        this.authUrl = 'https://www.strava.com/oauth/authorize';
        this.defaults = {
            responseType: 'code'
        };
    }
}
