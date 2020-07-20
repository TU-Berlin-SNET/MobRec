import { OAuthProvider } from "../provider";
export class Imgur extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://api.imgur.com/oauth2/authorize';
        this.defaults = {
            responseType: 'token'
        };
    }
}
