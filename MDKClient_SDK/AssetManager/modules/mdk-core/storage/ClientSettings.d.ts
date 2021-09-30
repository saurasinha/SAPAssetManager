import { LanguageSource } from '../utils/I18nLanguage';
import { RegionSource } from '../utils/I18nRegion';
export declare enum OnboardingState {
    OnboardingInProgress = 0,
    Live = 1,
    Demo = 2
}
export declare enum BlurScreenActions {
    Add = 0,
    Remove = 1
}
export declare enum PasscodeSource {
    UserOnboardedWithoutPasscode = 0,
    UserPasscodeOnly = 1,
    BiometricsOnly = 2,
    PasscodeWithBiometrics = 3
}
export declare enum ActivityResultRequestCode {
    AttachmentFormCell = 3241,
    OpenDocument = 9999
}
export declare class ClientSettings {
    static isUserChangingPasscode: boolean;
    static isVerifyingPasscode: boolean;
    static connectionInfoToastMessage: string;
    static isInAppQRScanFlow: boolean;
    private static policyPasscodeTimeout;
    private static readonly DEFAULT_ALLOWED_DOMAINS;
    private static readonly ALLOWED_SETTINGS;
    static userPasscode: String;
    static getPasscodeSource(): number;
    static setPasscodeSource(passcodeSource: number): void;
    static getCurrentApplicationVersion(): number;
    static setCurrentApplicationVersion(newVersion: number): void;
    static getStagedApplicationVersion(): number;
    static setStagedApplicationVersion(newVersion: number): void;
    static getApplicationServicePaths(): Array<string>;
    static setApplicationServicePaths(list: Array<string>): void;
    static setApplicationServicePath(path: string): void;
    static getODataInitializedDefinitions(): Array<any>;
    static setODataInitializedDefinition(odataServiceDefinition: any): void;
    static clearODataInitializedDefinitions(): void;
    static getSyncPendingODataTxnsOnUserChangeStatus(): string;
    static setSyncPendingODataTxnsOnUserChangeStatus(status: string): void;
    static getUserForPendingODataTxns(): string;
    static setUserForPendingODataTxns(user: string): void;
    static isOnboardingInProgress(): boolean;
    static getOnboardingState(): OnboardingState;
    static setOnboardingState(newState: OnboardingState): void;
    static isLiveMode(): boolean;
    static isDemoMode(): boolean;
    static getUpdateCSSRuleSetFlag(): boolean;
    static setUpdateCSSRuleSetFlag(flag: boolean): void;
    static resetApplicationVersions(): void;
    static resetExtensionControlSourceMap(): void;
    static resetOnLinkDataReceived(): void;
    static resetApplicationTheme(): void;
    static reset(): void;
    static getCpmsUrl(): string;
    static getAppId(): string;
    static getScreenSharing(): boolean;
    static getScreenSharingWithAndroidVersion(): boolean;
    static getServiceTimeZoneAbbreviation(): string;
    static getLcmsVersionCheckMinPeriod(): number;
    static getLcmsVersionCheckRandomMax(): number;
    static getLcmsAppDownloadRetryPeriod(): number;
    static getLcmsAppDownloadRetryCount(): number;
    static getApplicationName(): string;
    static getDetailLabelViewTitle(): string;
    static getDetailLabelViewText(): string;
    static getOnLinkDataReceived(): string;
    static setOnLinkDataReceived(linkData: any): void;
    static saveLinkDataObject(launchUrlString: any): void;
    static getAllowCerts(): any;
    static getSignInButtonText(): string;
    static getClientId(): string;
    static getAuthorizationEndpointURL(): string;
    static getRedirectURL(): string;
    static getTokenEndpointURL(): string;
    static isConnectionSettingsEnableOverrides(): boolean;
    static isMultiUserEnabled(): boolean;
    static getLogUploadingParams(): {
        ApplicationID: string;
        EndpointURL: string;
    };
    static getPasscodeTimeout(): number;
    static setPasscodeTimeout(passcodeTimeout: number): void;
    static getOnboardingParams(): Object;
    static skipEula(): Boolean;
    static obfuscateEmail(): Boolean;
    static getOnboardingCustomizations(): Object;
    static getCacheSettings(): Object;
    static validateOnboardingConnectionParamsExist(): boolean;
    static isDemoApplicationAvailable(): boolean;
    static getAppLanguage(): string;
    static getAppLanguageForUrlParam(): string;
    static getAppLanguageForUrlParamSAP(): string;
    static getAppLanguageSource(): LanguageSource;
    static getAppRegionSource(): RegionSource;
    static getAppLocale(): string;
    static getAppRegion(): string;
    static getAppFontScale(): number;
    static getDefaultAppLanguage(): string;
    static getEncryptDatabaseFlag(): boolean;
    static getExtensionControlSourceMap(): {};
    static getDebugODataProvider(): boolean;
    static getSupportedLanguages(): string[];
    static getProfilingEnabled(): boolean;
    static getODataServiceLanguageMap(): {};
    static getODataServiceLanguageParamMap(): {};
    static getTracingEnabled(): boolean;
    static getTracingCategories(): string[];
    static getUserDefinedLanguage(): string;
    static getUserDefinedRegion(): string;
    static hasLogSettings(): boolean;
    static getLogFileName(): string;
    static getLogFileSize(): number;
    static getLogLevel(): string;
    static getDemoBundlePath(): string;
    static getDemoDbPath(): string;
    static getDemoAppLanguage(): string;
    static setAppLanguage(language: string): void;
    static setAppLanguageIsRTL(language: string): void;
    static setLanguageForUrlParam(language: string): void;
    static getAppLanguageIsRTL(): boolean;
    static setAppLanguageSource(source: LanguageSource): void;
    static setAppRegionSource(source: RegionSource): void;
    static setAppFontScale(fontScale: number): void;
    static setApplicationStage(stage: string): void;
    static setAppLocale(locale: string): void;
    static setAppRegion(region: string): void;
    static setExtensionControlSourceMap(extensionControlSourceMap: {}): void;
    static setSupportedLanguages(languages: string[]): void;
    static setODataServiceLanguageMap(serviceLanguages: {}): void;
    static setODataServiceLanguageParamMap(serviceLanguageParams: {}): void;
    static setUserDefinedLanguage(language: string): void;
    static setUserDefinedRegion(region: string): void;
    static setHistoricalODataServicePath(set: any): void;
    static getHistoricalODataServicePath(): any;
    static latchBrandedSettings(): void;
    static resetlatchedConnectionSettings(): void;
    static storeAppLaunchSettings(): void;
    static setUserInfo(userId: string): void;
    static getUserInfo(): string;
    static setDeviceId(deviceId: string): void;
    static getDeviceId(): string;
    static setSession(session: Object): void;
    static getSession(): String;
    static setTheme(name: string): void;
    static getTheme(): string;
    static setAvailableThemes(themes: string): void;
    static getAvailableThemes(): string;
    static getConnecionInfoToastMessage(): string;
    static setConnecionInfoToastMessage(queryStr: string, absoluteString?: string): void;
    static processConnectionSettingsFromLaunchURL(queryStr: string): void;
    private static parseJsonQRResult;
    private static isAllowedConnectionSettings;
    static isConnectionSettingsValid(): boolean;
    private static isValidDomain;
    static setConnectionSettings(setting: Map<string, string>): void;
    private static setLatchedConnectionSettings;
    private static isAllowedConnectionSetting;
    static initializePersistentSettings(): void;
    private static clientIsActive;
    private static isPersistInitialized;
    private static _appLaunchSettings;
    private static _clientLatchedSettings;
    private static _savedAppLaunchSettings;
    private static _defaultSettings;
    private static _demoBrandedSettings;
    private static _demoOverrideSettings;
    private static _session;
    private static _brandingSettingLivePriority;
    private static _connectionSettingsLivePriority;
    private static _brandingSettingDemoPriority;
    private static _demoSettingDemoPriority;
    private static _connectionSettingDemoPriority;
    private static _brandingSettingPriorities;
    private static _demoSettingsPriorities;
    private static _connectionSettingsPriorities;
    private static _connectionSettingsKeyList;
    private static _demoRootSettingsKeyList;
    private static prioritiesInitialized;
    private static initializeSettings;
    private static getSetting;
    private static findSetting;
    private static getBrandingSetting;
    private static getDemoSetting;
    private static getConnectionSetting;
    private static latchDemoSettings;
    private static getOverrideDemoObject;
    private static getAllowedDomains;
    private static getAppSchemeAllowedDomains;
    private static writeLatchedSettingsToDisk;
    private static isValid;
    private static setAppSetting;
    private static _resetI18nSettings;
    private static trimUrl;
}
