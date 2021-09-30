export declare class WelcomeScreen {
    static getInstance(): WelcomeScreen;
    private static _instance;
    private welcomeScreenBridge;
    private callback;
    createCallback(callback: any, resolve?: any, reject?: any): any;
    create(params: any, callback: any): any;
    onLoaded(): any;
    applicationWillEnterBackground(): void;
    applicationWillEnterForeground(): Promise<any>;
    restoreOnRelaunch(params: any): Promise<any>;
    changeUserPasscode(): Promise<any>;
    verifyPasscode(params: any): Promise<any>;
    resetClient(): Promise<any>;
    showErrorScreen(params: any, onboardingParams: any): Promise<any>;
    showSyncInProgressScreen(onboardingParams: any): Promise<any>;
    finishUserSwitchSyncInProgress(): void;
    showNoNetworkScreen(onboardingParams: any): Promise<any>;
    isAppInMultiUserMode(): boolean;
}
