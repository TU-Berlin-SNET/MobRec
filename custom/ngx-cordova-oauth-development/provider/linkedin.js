import { OAuthProvider } from "../provider";
export class LinkedIn extends OAuthProvider {
    constructor() {
        super(...arguments);
        this.authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
        this.APP_SCOPE_DELIMITER = ' ';
        this.defaults = {
            responseType: 'code'
        };
    }
}
