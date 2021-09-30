export declare class WelcomeScreen {
    static getInstance(): WelcomeScreen;
    create(params: any, callback: any): void;
    onLoaded(): void;
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
    applicationWillEnterBackground(): void;
    finishUserSwitchSyncInProgress(): void;
    isAppInMultiUserMode(): boolean;
}
