/*
 * Angular 2 (ng2) Cordova Oauth
 * Created by Nic Raboy
 * http://www.nraboy.com
 */
import { utils } from './utility';
/*
 * The main driver class for connections to each of the providers.
 */
export class Oauth {
    constructor() {
        this.defaultWindowOptions = {};
    }
    login(provider, windowOptions = {}) {
        console.warn(`
        new CordovaOauth().login(...) is deprecated and will be removed in the next release.
        Please use new CordovaOauth().logInVia(...) instead.
      `);
        return this.logInVia(provider, windowOptions);
    }
    logInVia(provider, windowOptions = {}) {
        const url = provider.dialogUrl();
        return this.openDialog(url, utils.defaults(windowOptions, this.defaultWindowOptions), {
            resolveOnUri: provider.options.resolveOnUri || provider.options.redirectUri,
            providerName: provider.name
        }).then((event) => {
            return provider.parseResponseInUrl(event.url);
        });
    }
    serializeOptions(options) {
        const chunks = [];
        for (const prop in options) {
            if (options.hasOwnProperty(prop)) {
                chunks.push(`${prop}=${options[prop]}`);
            }
        }
        return chunks.join(',');
    }
    openDialog(url, windowParams, options = {}) {
        return Promise.reject(new Error('Not implemented'));
    }
}
