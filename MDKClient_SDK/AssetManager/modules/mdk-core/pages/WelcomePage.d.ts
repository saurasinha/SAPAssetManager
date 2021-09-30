import { Page } from 'tns-core-modules/ui/page';
import { WelcomeScreenBridge } from 'mdk-sap';
import { BlurScreenActions } from '../storage/ClientSettings';
export declare class WelcomePage extends Page {
    static welcomeScreenBridge: WelcomeScreenBridge;
    private static pendingODataTxnsForPrevUserPromise;
    private userSwitchedParams;
    private static readonly OFFLINE_TRANSACTION_NO_INTERNET_ERROR_CODE;
    static changeUserPasscode(): Promise<boolean>;
    static verifyPasscode(params: any): Promise<any>;
    static restoreOnRelaunch(params: any): Promise<boolean>;
    static applicationWillEnterForeground(): Promise<boolean>;
    static manageBlurScreen(action: BlurScreenActions): void;
    static resetClientHelper(): Promise<any>;
    static reInitializePage(): void;
    static applicationWillEnterBackground(): void;
    static getConnectionInfoToastMessage(params: any): any;
    static getCacheSettings(params: any): any;
    static fireChangeUserPasscodeSuccessOrFailureAction(status: string): void;
    static fireVerifyPasscodeSuccessOrFailureAction(status: string): void;
    static getPendingODataTxnsForPrevUserPromise(): Promise<any>;
    private context;
    private aScreen;
    constructor();
    onLoaded(): void;
    static getOnboardingParams(): any;
    finishedLoadingRegistrationInfo(data: any): void;
    finishedOnboardingWithParams(newValue: any): any;
    qrCodeScanComplete(queryString: string): void;
    setPasscodeTimeout(passcodeTimeout: number): void;
    setOnboardingStage(stage: string): void;
    resetInitializedOData(): void;
    finishedRestoringWithParams(newValue: any): Promise<void>;
    userSwitchedWithParams(newValue: any): void;
    retryPrevUserPendingTxnsUpload(): void;
    private _getStatusBarStyleByAppearance;
    private syncPendingODataTxnsForPrevUser;
    private fetchConnnectionSettings;
}