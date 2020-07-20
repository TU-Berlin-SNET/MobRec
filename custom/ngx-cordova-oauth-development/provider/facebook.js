import { OAuthProvider } from "../provider";
export class Facebook extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://www.facebook.com/v2.0/dialog/oauth';
        this.defaults = {
            responseType: 'token'
        };
        if (!options.appScope || options.appScope.length <= 0) {
            throw new Error(`A ${this.name} app scope must exist`);
        }
    }
    optionsToDialogUrl(options) {
        let url = super.optionsToDialogUrl(options);
        if (options.authType) {
            url += `&auth_type=${options.authType}`;
        }
        return url;
    }
}
