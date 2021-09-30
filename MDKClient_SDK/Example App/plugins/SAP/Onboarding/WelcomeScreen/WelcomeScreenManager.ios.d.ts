export declare class WelcomeScreen {
    static getInstance(): WelcomeScreen;
    private static _instance;
    private welcomeScreenBridge;
    create(params: any, callback: any): any;
    reInitializePage(params: any): void;
    manageBlurScreen(params: any): void;
    applicationWillEnterForeground(): Promise<any>;
    changeUserPasscode(): Promise<any>;
    verifyPasscode(params: any): Promise<any>;
    restoreOnRelaunch(params: any): Promise<any>;
    resetClient(): Promise<any>;
    showErrorScreen(params: any, onboardingParams: any): Promise<any>;
    showSyncInProgressScreen(onboardingParams: any): Promise<any>;
    showNoNetworkScreen(onboardingParams: any): Promise<any>;
    finishUserSwitchSyncInProgress(): void;
    isAppInMultiUserMode(): boolean;
}
