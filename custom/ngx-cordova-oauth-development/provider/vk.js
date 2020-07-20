import { OAuthProvider } from "../provider";
import { utils } from '../utility';
export class VK extends OAuthProvider {
    constructor(options = {}) {
        super(options);
        this.authUrl = 'https://oauth.vk.com/authorize';
        this.defaults = {
            responseType: 'token',
            redirectUri: 'https://oauth.vk.com/blank.html'
        };
        if (!options.appScope || options.appScope.length <= 0) {
            throw new Error(`A ${this.name} app scope must exist`);
        }
    }
    optionsToDialogUrl(options) {
        utils.defaults(options, this.defaults);
        let url = super.optionsToDialogUrl(options);
        if (options.display) {
            url += `&display=${options.display}`;
        }
        if (options.v) {
            url += `&v=${options.v}`;
        }
        if (options.revoke) {
            url += `&revoke=${options.revoke}`;
        }
        return url;
    }
}
