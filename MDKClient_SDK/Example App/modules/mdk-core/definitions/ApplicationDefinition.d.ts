import { BaseJSONDefinition } from './BaseJSONDefinition';
export declare class ApplicationDefinition extends BaseJSONDefinition {
    getMainPage(): any;
    getOnLaunch(): any;
    getOnUnCaughtError(): any;
    getOnExit(): any;
    getOnUserSwitch(): any;
    getStyles(): any;
    getStyleSheets(): any;
    getCSSStyles(theme: string): any;
    getSDKStyles(theme?: string): any;
    getLocalization(): any;
    getOnWillUpdate(): any;
    getOnDidUpdate(): any;
    getVersion(): any;
    readonly foregroundNotificationEventHandler: any;
    readonly contentAvailableEventHandler: any;
    readonly receiveNotificationResponseEventHandler: any;
    getOnSuspend(): any;
    getOnResume(): any;
    getOnLinkDataReceived(): any;
}
