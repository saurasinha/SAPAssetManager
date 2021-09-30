interface ILogger {
    setCategory(category: string): ILogger;
    error(message: string, ...args: any[]): any;
    info(message: string, ...args: any[]): any;
    log(message: string, ...args: any[]): any;
    warn(message: string, ...args: any[]): any;
}
export declare enum TraceCategories {
    action = "mdk.trace.action",
    api = "mdk.trace.api",
    app = "mdk.trace.app",
    binding = "mdk.trace.binding",
    branding = "mdk.trace.branding",
    core = "mdk.trace.core",
    i18n = "mdk.trace.i18n",
    lcms = "mdk.trace.lcms",
    logging = "mdk.trace.logging",
    odata = "mdk.trace.odata",
    onboarding = "mdk.trace.onboarding",
    profiling = "mdk.trace.profiling",
    push = "mdk.trace.push",
    restservice = "mdk.trace.restservice",
    settings = "mdk.trace.settings",
    targetPath = "mdk.trace.targetpath",
    ui = "mdk.trace.ui"
}
declare abstract class ConsoleLogger implements ILogger {
    protected _category: string;
    protected severity: string;
    error(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    log(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    setCategory(category: string): ILogger;
    protected toConsole(severity: string, message: string): void;
    private _logMessage;
    private _severityToAsNumber;
}
declare class DefaultLogger extends ConsoleLogger {
    static readonly instance: DefaultLogger;
    static ACTION_RUNNING_FAILED: string;
    static APPUPDATE_FAILED: string;
    static CLIENTSETTINGS_MISSING_APPLICATION: string;
    static CLIENTSETTINGS_MISSING_DEMO_APPLICATION: string;
    static DEFINITIONLOADER_APPLICATION_DEFINITIONS_NOT_FOUND: string;
    static ERROR: string;
    static LOGMANAGER_UPLOAD_FAILED: string;
    static NO_SELECTED_ITEM_FOR_ROW: string;
    static PATHS_FAILED_ACCESSS_EXTERNAL_STORAGE: string;
    static PATHS_FAILED_ACCESSS_INTERNAL_STORAGE: string;
    static STARTUP_EXECUTE_FAILED: string;
    static STARTUP_LAUNCH_FAILED: string;
    static STARTUP_SETTING_KEY_INCORRECT_VALUE: string;
    static STARTUP_URL_KEY_INCORRECT_VALUE: string;
    static VALUERESOLVER_PARSE_FAILED: string;
    static INCORRECT_DATE_INPUT: string;
    static RESOLVE_INITOFFLINEODATA_PROGRESS_TEXT_FAILED: string;
    static UNABLE_TO_FETCH_DATA_FROM_TARGET_SERVICE: string;
    static SIDEDRAWER_HEADER_ICON_PARSE_FAILED: string;
    static FAILED_TO_SET_CLICK_LISTENER: string;
    static INVALID_JSON_FORMAT: string;
    static CACHE_DIRECTORY_ACCESS_FAILED: string;
    static INVALID_OFFLINE_ODATA_INITIALIZE_DEFINITION: string;
    static OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_KEY: string;
    static OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_VALUE: string;
    static OBSERVABLE_OBJECTHEADERSECTION_BINDING_FAILED: string;
    static SETITEMCAPTION_TOOLBAR_ITEM_NOT_FOUND: string;
    static SETTOOLBARITEMCAPTION_TOOLBAR_NOT_FOUND: string;
    static SETITEMCAPTION_TAB_ITEM_NOT_FOUND: string;
    static GETITEMCAPTION_TAB_ITEM_NOT_FOUND: string;
    static INVALID_FONTICON_UNICODE: string;
    static UNABLE_TO_GET_SIDEDRAWER_SELECTED_FRAME: string;
    static CLIENTSETTINGS_LOG_FOUND_WITH_VALUE: string;
    static CLIENTSETTINGS_NO_VALUE_FOUND_FOR_KEY: string;
    static CLIENTSETTINGS_PATH_TO_OVERRIDES: string;
    static PATHS_EXTERNAL_STORAGE_MOUNT_STATUS: string;
    static STARTUP_APP_LAUNCHED_VIA_URL: string;
    static STARTUP_APP_URL_PARAM_CHECK_SUCCESS: string;
    static STARTUP_INSIDE_APPLICATIONDIDBECOMEACTIVE_DELEGATE_METHOD: string;
    static STARTUP_INSIDE_APPLICATIONWILLRESIGNACTIVE_DELEGATE_METHOD: string;
    static STARTUP_READY_FOR_ONBOARDING: string;
    static RESTORING_ONBOARDED_APP: string;
    static LOADMOREITEMS_NOT_SUPPORTED: string;
    static PULL_TO_REFRESH_NOT_SUPPORTED: string;
    static INVALID_PAGE_DEFINITION: string;
    static ACTION_LOG_LEVEL: string;
    static ACTION_NATIVE_LOG: string;
    static APPUPDATE_ROLL_BACK_PREVIOUS: string;
    static SUCCESSFULLY_APPLY_SDK_STYLES: string;
    static SUCCESSFULLY_APPLY_STYLES: string;
    static DEFINITIONLOADER_LOADING_DEFINITIONS: string;
    static LOGMANAGER_UPLOAD_SUCCEEDED: string;
    static STARTUP_ERROR_IN_APPEVENTDATA_IOS: string;
    static STARTUP_PROCESSING_KEYVALUEPAIR: string;
    static STARTUP_STACKTRACE: string;
    static STARTUP_STORE_CLIENT_RESET_SUCCEED: string;
    static TARGETPATHINTERPRETER_PROCESSING_PATH_SEGMENT: string;
    static VALIDATION_NOT_BOOLEAN: string;
    static VALIDATION_NOT_STRING: string;
    static VALIDATION_NOT_SUPPORTED_PROPERTY: string;
    static VALIDATION_NOT_VALID_HEX_COLOR: string;
    private static _instance;
    private static _innerInstance;
    readonly action: ILogger;
    readonly api: ILogger;
    readonly app: ILogger;
    readonly appDelegate: ILogger;
    readonly appUpdate: ILogger;
    readonly branding: ILogger;
    readonly clientSettings: ILogger;
    readonly core: ILogger;
    readonly definitionLoader: ILogger;
    readonly extension: ILogger;
    readonly formCell: ILogger;
    readonly formCellExtension: ILogger;
    readonly i18n: ILogger;
    readonly lcms: ILogger;
    readonly logManager: ILogger;
    readonly odata: ILogger;
    readonly paths: ILogger;
    readonly profiling: ILogger;
    readonly restservice: ILogger;
    readonly startup: ILogger;
    readonly targetPath: ILogger;
    readonly page: ILogger;
    readonly ui: ILogger;
    readonly validation: ILogger;
    readonly valueResolver: ILogger;
    protected toConsole(method: string, message: string): void;
    private getLogger;
}
export { DefaultLogger as Logger };
