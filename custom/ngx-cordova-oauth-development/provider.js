import { utils } from './utility';
const DEFAULTS = {
    redirectUri: 'http://localhost/callback'
};
export class OAuthProvider {
    constructor(options = {}) {
        this.APP_SCOPE_DELIMITER = ',';
        this.authUrl = '';
        this.defaults = {};
        this.options = utils.defaults(options, DEFAULTS);
    }
    get name() {
        return this.constructor.name || this.authUrl;
    }
    parseResponseInUrl(url) {
        const response = utils.parseQueryString(url);
        if (!this.isValid(response)) {
            const error = new Error(`Problem authenticating with ${this.name}`);
            Object.defineProperty(error, 'response', { value: response });
            throw error;
        }
        return response;
    }
    dialogUrl() {
        return this.optionsToDialogUrl(this.options);
    }
    optionsToDialogUrl(options) {
        utils.defaults(options, this.defaults);
        let url = `${this.authUrl}?client_id=${options.clientId}&redirect_uri=${encodeURIComponent(options.redirectUri)}`;
        if (options.appScope) {
            url += `&scope=${this.serializeAppScope(options.appScope)}`;
        }
        if (options.state) {
            url += `&state=${options.state}`;
        }
        if (options.responseType) {
            url += `&response_type=${options.responseType}`;
        }
        return url;
    }
    serializeAppScope(scope) {
        return typeof scope.join === 'function' ? scope.join(this.APP_SCOPE_DELIMITER) : scope;
    }
    isValid(response) {
        return !response.error && (response.code || response['access_token']);
    }
}
