import { Oauth } from '../oauth';

export declare class OauthSafariController extends Oauth {
    private resolveOpenedDialog;
    defaultWindowOptions: any;
    constructor();
    protected setupDeeplinks(options: any): void;
    protected openDialog(url: string, params: any): Promise<{}>;
    protected setupTimer(delay: any, done: any): 0 | NodeJS.Timeout;
    protected closeDialog(timerId?: any): void;
}
