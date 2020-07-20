import { OAuthProvider } from "../provider";
export class Instagram extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://api.instagram.com/oauth/authorize';
        this.APP_SCOPE_DELIMITER = '+';
        this.defaults = {
            responseType: 'token'
        };
    }
}
