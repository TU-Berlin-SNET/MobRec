import { OAuthProvider } from "../provider";
export class Google extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://accounts.google.com/o/oauth2/auth';
        this.APP_SCOPE_DELIMITER = ' ';
        this.defaults = {
            responseType: 'token'
        };
        if (!options.appScope || options.appScope.length <= 0) {
            throw new Error(`A ${this.name} app scope must exist`);
        }
    }
    optionsToDialogUrl(options) {
        return super.optionsToDialogUrl(options) + '&approval_prompt=force';
    }
}
