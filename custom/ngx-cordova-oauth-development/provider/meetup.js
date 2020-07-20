import { OAuthProvider } from "../provider";
export class Meetup extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://secure.meetup.com/oauth2/authorize/';
        this.defaults = {
            responseType: 'token'
        };
    }
}
