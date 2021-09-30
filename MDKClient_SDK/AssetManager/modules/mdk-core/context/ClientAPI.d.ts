import { LoggerManager } from 'mdk-sap';
import { PressedItem } from '../controls/PressedItem';
import { IView } from '../IView';
import { IActionResult, IClientAPI, IControlContainerProxy, IControlProxy, IFormCellProxy, IFormCellTargetProxy, ILinkSpecifierProxy, IListPickerFormCellTargetProxy, IPageProxy, ISectionedTableProxy, ISectionProxy, ITargetProxy, IToolbarProxy, ITabControlProxy, ITabItemProxy, ISideDrawerControlProxy, ISideDrawerMenuItemProxy, IBindableSectionProxy, ISelectableSectionProxy, IODataProviderProxy, IOfflineODataProviderProxy, IOfflineODataParametersProxy, IHttpResponse, IHttpResponseContent } from './IClientAPI';
import { IClientAPIProps, IClientData, IContext } from './IContext';
import { DataQueryBuilder } from '../builders/odata/DataQueryBuilder';
import { SideDrawer } from '../controls/SideDrawer';
import { ContextItem } from '../controls/ContextItem';
import { ChangedItem, SelectedItem } from '../controls/SelectedItem';
import { FilterCriteria, FilterType } from '../controls/IFilterable';
export declare class ClientAPI implements IClientAPI {
    protected _context: IContext;
    static Create(context: IContext): ClientAPI;
    constructor(_context: IContext);
    readonly filterTypeEnum: typeof FilterType;
    createFilterCriteria(filterType: FilterType, name: string, caption: string, filterItems: Array<object>, isFilterItemsComplex?: boolean): FilterCriteria;
    readonly binding: Object;
    readonly actionResults: any;
    evaluateTargetPath(path: string): any;
    evaluateTargetPathForAPI(path: string): IClientAPI;
    formatCurrency(value: number, currencyCode: string, customLocale?: string, customOptions?: any): string;
    formatDate(date: Date, customLocale?: string, customTimeZone?: string, customOptions?: any): string;
    formatDatetime(date: Date, customLocale?: string, customTimeZone?: string, customOptions?: any): string;
    formatNumber(value: number, customLocale?: string, customOptions?: any): string;
    formatPercentage(value: number, customLocale?: string, customOptions?: any): string;
    formatScientific(value: number, customLocale?: string, customOptions?: any): string;
    formatTime(date: Date, customLocale?: string, customTimeZone?: string, customOptions?: any): string;
    base64StringToBinary(base64: string): Promise<any>;
    formatBase64String(base64: string, contentType: string): string;
    getBindingObject(): Object;
    getReadLink(path: string): string;
    initializeLogger(fileName?: any, maxFileSize?: any): void;
    getLogger(): LoggerManager;
    executeAction(actionPath: string): Promise<IActionResult>;
    updateProgressBanner(message: string): void;
    isMediaLocal(serviceName: string, entitySet: string, readLink: string): Promise<boolean>;
    read(serviceName: string, entitySet: string, properties: string[], queryOptions?: string, headers?: Object, requestOptions?: Object): Promise<any>;
    callFunction(serviceName: string, oFunction: {
        Name: string;
        Parameters?: {
            key: string;
            value: any;
        };
    }, headers?: Object): Promise<any>;
    create(serviceName: string, entitySet: string, properties: {
        key: string;
        value: any;
    }, createLinks: ILinkSpecifierProxy[], headers?: {
        key: string;
        value: any;
    }, requestOptions?: {
        key: string;
        value: any;
    }): Promise<any>;
    getGlobalDefinition(globalPath: string): any;
    getCircularImage(base64EncodedImageStr: string): string;
    getIconTextImage(iconText: string, width: number, height: number, isCircular: true, stylesJSON?: string): string;
    getPendingDownload(page: string): any;
    getDefinitionValue(target: string): Promise<any>;
    getClientData(): IClientData;
    getAppEventData(): any;
    getActionResult(key: string): IActionResult;
    getLanguage(): string;
    getRegion(): string;
    getSupportedLanguages(): Object;
    getRegions(): Object;
    isDemoMode(): Boolean;
    isAppInMultiUserMode(): Boolean;
    localizeText(key: string, dynamicParams?: string[]): string;
    count(serviceName: string, entitySet: string, queryOptions?: string, headers?: Object, requestOptions?: Object): Promise<any>;
    createLinkSpecifierProxy(property: string, entitySet: string, queryOptions?: string, readLink?: string): ILinkSpecifierProxy;
    downloadInProgressForReadLink(readLink: string): boolean;
    downloadInProgressForPage(page: string): boolean;
    getPasscodeSource(): number;
    isCurrentPage(pageName: string): boolean;
    readonly currentPage: any;
    dismissActivityIndicator(id?: number): void;
    showActivityIndicator(text?: string): number;
    setApplicationIconBadgeNumber(badge: number): void;
    setLanguage(languageKey: string): void;
    setRegion(region: string): void;
    getAvailableThemes(): string[];
    getTheme(): string;
    setTheme(newTheme: string): boolean;
    getVersionInfo(): Object;
    sendRequest(path: string, params?: any): Promise<IHttpResponse>;
    sendMobileServiceRequest(path: string, params?: any): Promise<any>;
    getMobileServiceEndpointUrl(): string;
    getMobileServiceAppId(): string;
    getSAPPassportHeaderValue(componentName: string, action: string, traceFlag: string, componentType: string, prevComponentName?: string, userId?: string): string;
    getODataProvider(serviceName: string): ODataProviderProxy;
    protected _clientAPIProps(): IClientAPIProps;
}
export declare class ControlProxy extends ClientAPI implements IControlProxy {
    protected _control: any;
    constructor(context: IContext);
    applyValidation(): void;
    clearValidation(): void;
    clearValidationOnValueChange(): void;
    getCaption(): string;
    getName(): string;
    getPageProxy(): IPageProxy;
    getType(): string;
    getValue(): any;
    isContainer(): boolean;
    redraw(): void;
    setEditable(value: boolean): this;
    setStyle(styleClass: string, subView: string): this;
    setValidationProperty(key: string, value: any): ControlProxy;
    setValue(value: any, notify?: boolean): this;
    setVisible(value: boolean, redraw?: boolean): this;
}
export declare class FormCellContainerProxy extends ControlProxy implements IControlContainerProxy {
    private _container;
    constructor(context: IContext);
    getCaption(): string;
    getControl(name: string): IControlProxy;
    getControls(): IControlProxy[];
    isContainer(): boolean;
}
export declare class TargetProxy implements ITargetProxy {
    protected _specifier: any;
    protected _entitySet: string;
    protected _queryOptions: string;
    protected _serverSidePaging: boolean;
    protected _service: string;
    protected _function: any;
    protected _path: string;
    protected _outputPath: string;
    protected _requestProperties: any;
    protected _readLink: string;
    constructor(specifier: any);
    readonly specifier: any;
    getEntitySet(): string;
    getFunction(): any;
    getOutputPath(): string;
    getPath(): string;
    getReadLink(): string;
    getRequestProperties(): string;
    getQueryOptions(): string;
    getServerSidePaging(): boolean;
    getService(): string;
    setEntitySet(value: string): this;
    setFunction(value: any): this;
    setOutputPath(value: string): this;
    setPath(value: string): this;
    setQueryOptions(value: string): this;
    setReadLink(value: string): this;
    setRequestProperties(value: any): this;
    setServerSidePaging(value: boolean): this;
    setService(value: string): this;
}
export declare class FormCellTargetProxy extends TargetProxy implements IFormCellTargetProxy {
    private _displayValue;
    private _returnValue;
    constructor(specifier: any);
    getDisplayValue(): string;
    getReturnValue(): string;
    setDisplayValue(value: string): this;
    setReturnValue(value: string): this;
}
export declare class ListPickerFormCellTargetProxy extends FormCellTargetProxy implements IListPickerFormCellTargetProxy {
    private _objectCell;
    constructor(specifier: any);
    getObjectCell(): any;
    setObjectCell(value: any): this;
}
export declare class FormCellControlProxy extends ControlProxy implements IFormCellProxy {
    private _dataQueryBuilder;
    constructor(context: IContext);
    dataQueryBuilder(query?: string): DataQueryBuilder;
    readonly searchString: string;
    visible: boolean;
    createAttachmentEntry(attachmentPath: string, entitySet: string, property: string, readLink: string, service: string, encodeURI?: boolean): any;
    getTargetSpecifier(): IFormCellTargetProxy;
    setTargetSpecifier(specifier: IFormCellTargetProxy, redraw?: boolean): Promise<any>;
    getCollection(): {
        DisplayValue: string;
        ReturnValue: string;
    }[];
    setFocus(keyboardVisibility: string): void;
    private _isValidAttachment;
}
export declare class ListPickerFormCellProxy extends FormCellControlProxy {
    getTargetSpecifier(): ListPickerFormCellTargetProxy;
    setTargetSpecifier(specifier: IFormCellTargetProxy, redraw?: boolean): Promise<any>;
}
export declare class PageProxy extends ClientAPI implements IPageProxy {
    private _page;
    constructor(context: IContext);
    getActionBinding(): any;
    getCaption(): string;
    getGlobalSideDrawerControlProxy(): ISideDrawerControlProxy;
    getControl(name: string): IControlProxy;
    getControls(): IControlProxy[];
    getMissingRequiredControls(): Object[];
    getPressedItem(): PressedItem;
    getExecutedContextMenuItem(): ContextItem;
    setActionBinding(binding: Object): this;
    setCaption(caption: string): void;
    redraw(): void;
    setStyle(styleClass: string, subControl?: string): this;
    setActionBarItemVisible(item: number, visibleFlag: boolean): void;
    setToolbarItemCaption(toolbarItemName: string, newCaption: string): Promise<any>;
    getPageProxy(): IPageProxy;
}
export declare class SectionedTableProxy extends ControlProxy implements ISectionedTableProxy {
    private _sections;
    private _dataQueryBuilder;
    constructor(context: IContext);
    isContainer(): boolean;
    dataQueryBuilder(query?: string): DataQueryBuilder;
    getSections(): ISectionProxy[];
    readonly sections: ISectionProxy[];
    getSection(name: string): ISectionProxy;
    searchString: string;
    getControl(name: string): IControlProxy;
    getControls(): IControlProxy[];
}
export declare class SectionProxy extends ClientAPI implements ISectionProxy {
    constructor(context: IContext);
    getExtensions(): IView[];
    getPageProxy(): IPageProxy;
    getName(): string;
    getProperty(): string;
    getType(): string;
    isStaticSection(): boolean;
    setIndicatorState(newState: string, pressedItem: PressedItem): any;
    readonly searchString: string;
    getControl(name: string): IControlProxy;
    getControls(): IControlProxy[];
    redraw(): Promise<any>;
    getVisible(): boolean;
    setVisible(value: boolean, redraw?: boolean): Promise<any>;
    dataSubscriptions: string[];
}
export declare class BindableSectionProxy extends SectionProxy implements IBindableSectionProxy {
    constructor(context: IContext);
    getTargetSpecifier(): ITargetProxy;
    setTargetSpecifier(specifier: ITargetProxy, redraw?: boolean): Promise<any>;
}
export declare class SelectableSectionProxy extends BindableSectionProxy implements ISelectableSectionProxy {
    constructor(context: IContext);
    getSelectedItems(): [SelectedItem];
    setSelectionMode(mode: string): any;
    getSelectionMode(): string;
    getSelectionChangedItem(): ChangedItem;
}
export declare class LinkSpecifierProxy implements ILinkSpecifierProxy {
    private _property;
    private _entitySet;
    private _queryOptions;
    private _readLink;
    constructor(property: string, entitySet: string, queryOptions?: string, readLink?: string);
    getSpecifier(): {};
    getProperty(): string;
    getEntitySet(): string;
    getQueryOptions(): string;
    getReadLink(): string;
    setProperty(value: string): void;
    setEntitySet(value: string): void;
    setQueryOptions(value: string): void;
    setReadLink(value: string): void;
}
export declare class ToolbarControlProxy extends ControlProxy implements IToolbarProxy {
    private _container;
    constructor(context: IContext);
    getToolbarControls(): IControlProxy[];
}
export declare class TabControlProxy extends ControlProxy implements ITabControlProxy {
    private _items;
    constructor(context: IContext);
    isContainer(): boolean;
    readonly tabItems: IControlProxy[];
    setItemCaption(tabItemName: string, newCaption: string): void;
    setSelectedTabItemByName(tabItemName: string): void;
    setSelectedTabItemByIndex(tabItemIndex: number): void;
    getItemCaption(tabItemName: string): string;
    getSelectedTabItemName(): number;
    getSelectedTabItemIndex(): number;
}
export declare class TabItemProxy extends ControlProxy implements ITabItemProxy {
    private _container;
    constructor(context: IContext);
    getCaption(): string;
    setCaption(newCaption: string): void;
}
export declare class SideDrawerControlProxy extends ControlProxy implements ISideDrawerControlProxy {
    private _items;
    constructor(context: IContext);
    isContainer(): boolean;
    setSideDrawerButton(iconPath: string): any;
    readonly menuItems: Array<ISideDrawerMenuItemProxy[]>;
    readonly sections: string[];
    getSelectedMenuItemIndexPath(): [number, number];
    getSelectedMenuItemName(): string;
    setSelectedMenuItemByName(name: string): void;
    setSelectedMenuItemByIndexPath(indexPath: [number, number]): void;
    getMenuItemsAtSection(sectionIndex: number): ISideDrawerMenuItemProxy[];
    setSectionVisibilityAtIndex(sectionIndex: number, visibility: boolean): void;
}
export declare class SideDrawerMenuItemProxy extends ClientAPI implements ISideDrawerMenuItemProxy {
    private _container;
    private _indexPath;
    constructor(indexPath: [number, number], container: SideDrawer, context: IContext);
    getTitle(): string;
    setTitle(title: string): void;
    setVisibility(visibility: boolean): void;
}
export declare class ODataProviderProxy implements IODataProviderProxy {
    protected _serviceName: string;
    constructor(serviceName: string);
    isOfflineEnabled(): boolean;
    isInitialized(): boolean;
}
export declare class OfflineDataProviderProxy extends ODataProviderProxy implements IOfflineODataProviderProxy {
    isOfflineEnabled(): boolean;
    getOfflineParameters(): IOfflineODataParametersProxy;
}
export declare class OfflineDataParametersProxy implements IOfflineODataParametersProxy {
    private _serviceName;
    constructor(serviceName: string);
    getCustomHeaders(): Object;
    setCustomHeaders(headers: {
        key: string;
        value: string;
    }): void;
}
export declare class HttpResponseContentProxy implements IHttpResponseContent {
    private _url;
    private _responseAndData;
    constructor(url: any, responseAndData: any);
    getData(): any;
    toFile(destinationFilePath?: string): File;
    toImage(): any;
    toString(): string;
}
export declare class HttpResponseProxy implements IHttpResponse {
    headers: Object;
    mimeType: string;
    statusCode: number;
    content: IHttpResponseContent;
    constructor(headers: Object, mimeType: string, statusCode: number, content: IHttpResponseContent);
}
