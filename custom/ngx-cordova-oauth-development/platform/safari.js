var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Oauth } from '../oauth';
export class OauthSafariController extends Oauth {
    constructor() {
        super();
        this.defaultWindowOptions = {
            timeout: 60000
        };
        console.log('hi', SafariViewController);
        this.setupDeeplinks({ loginPath: '/login' });
    }
    setupDeeplinks(options) {
        IonicDeeplink.route({}, null, match => {
            if (match.$link.path === options.loginPath && this.resolveOpenedDialog) {
                this.resolveOpenedDialog({ url: match.$link.url });
            }
        });
    }
    openDialog(url, params) {
        console.log('hello', SafariViewController);
        return new Promise((resolve, reject) => {
            SafariViewController.isAvailable(isAvailable => {
                if (!isAvailable) {
                    return reject(new Error('SafariViewController is not available'));
                }
                const { timeout } = params, windowParams = __rest(params, ["timeout"]);
                const timerId = this.setupTimer(timeout, reject);
                this.resolveOpenedDialog = data => {
                    this.closeDialog(timerId);
                    resolve(data);
                };
                SafariViewController.show(Object.assign({ url }, windowParams), null, message => {
                    this.closeDialog(timerId);
                    reject(new Error(message));
                });
            });
        });
    }
    setupTimer(delay, done) {
        if (delay === 0) {
            return 0;
        }
        return setTimeout(() => {
            this.closeDialog();
            done(new Error(`Did not receive response from Oauth provider after ${delay}ms`));
        }, delay);
    }
    closeDialog(timerId = null) {
        if (timerId) {
            clearTimeout(timerId);
        }
        this.resolveOpenedDialog = null;
        SafariViewController.hide();
    }
}
