"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var mdk_sap_1 = require("mdk-sap");
var TargetServiceBuilder_1 = require("../builders/odata/service/TargetServiceBuilder");
var IControl_1 = require("../controls/IControl");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var IDataService_1 = require("../data/IDataService");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var EventHandler_1 = require("../EventHandler");
var IMDKPage_1 = require("../pages/IMDKPage");
var BaseSection_1 = require("../sections/BaseSection");
var BaseSectionDefinition_1 = require("../definitions/sections/BaseSectionDefinition");
var ClientSettings_1 = require("../storage/ClientSettings");
var ProgressBannerAction_1 = require("../actions/ProgressBannerAction");
var TargetPathInterpreter_1 = require("../targetpath/TargetPathInterpreter");
var AppSettingsManager_1 = require("../utils/AppSettingsManager");
var I18nFormatter_1 = require("../utils/I18nFormatter");
var I18nHelper_1 = require("../utils/I18nHelper");
var I18nLanguage_1 = require("../utils/I18nLanguage");
var I18nRegion_1 = require("../utils/I18nRegion");
var Logger_1 = require("../utils/Logger");
var HttpHeadersUtil_1 = require("../utils/HttpHeadersUtil");
var ValueResolver_1 = require("../utils/ValueResolver");
var Context_1 = require("./Context");
var fileSystem = require("tns-core-modules/file-system");
var image_source_1 = require("tns-core-modules/image-source");
var DataQueryBuilder_1 = require("../builders/odata/DataQueryBuilder");
var ImageHelper_1 = require("../utils/ImageHelper");
var TabFrame_1 = require("../pages/TabFrame");
var StyleHelper_1 = require("../utils/StyleHelper");
var IFilterable_1 = require("../controls/IFilterable");
var PNG_BASE64_PREFIX = 'data:image/png;base64;alwaystemplate,';
var JPG_BASE64_PREFIX = 'data:image/jpg;base64;alwaystemplate,';
var JPEG_BASE64_PREFIX = 'data:image/jpeg;base64;alwaystemplate,';
var ClientAPI = (function () {
    function ClientAPI(_context) {
        this._context = _context;
    }
    ClientAPI.Create = function (context) {
        if (IMDKPage_1.isMDKPage(context.element)) {
            return new PageProxy(context);
        }
        else if (IControl_1.isControl(context.element) && context.element.viewIsNative) {
            var control = context.element;
            if (control.definition().getType() === 'Control.Type.ToolbarItem') {
                return new ToolbarControlProxy(context);
            }
            else if (control.definition().getType() === 'Control.Type.FormCellContainer') {
                return new FormCellContainerProxy(context);
            }
            else if (control.definition().getType() === 'Control.Type.SectionedTable') {
                return new SectionedTableProxy(context);
            }
            else if (control.definition().getType() === 'Control.Type.BottomNavigation' ||
                control.definition().getType() === 'Control.Type.Tabs') {
                return new TabControlProxy(context);
            }
            else if (control.definition().getType() === 'Control.Type.TabItem') {
                return new TabItemProxy(context);
            }
            else if (control.definition().getType() === 'Control.Type.SideDrawer') {
                return new SideDrawerControlProxy(context);
            }
            else if (control.getContainer
                && control.getContainer()
                && control.getContainer().definition().getType() === 'Control.Type.FormCellContainer') {
                if (control.definition().getType() === 'Control.Type.FormCell.ListPicker') {
                    return new ListPickerFormCellProxy(context);
                }
                else {
                    return new FormCellControlProxy(context);
                }
            }
            else if (control.parentSection
                && control.parentSection.definition.type === 'Section.Type.FormCell') {
                if (control.definition().getType() === 'Control.Type.FormCell.ListPicker') {
                    return new ListPickerFormCellProxy(context);
                }
                else {
                    return new FormCellControlProxy(context);
                }
            }
            return new ControlProxy(context);
        }
        else if (BaseSection_1.isSection(context.element)) {
            if (BaseSection_1.isSelectableSection(context.element)) {
                return new SelectableSectionProxy(context);
            }
            else if (BaseSection_1.isBindableSection(context.element)) {
                return new BindableSectionProxy(context);
            }
            else {
                return new SectionProxy(context);
            }
        }
        else {
            return new ClientAPI(context);
        }
    };
    Object.defineProperty(ClientAPI.prototype, "filterTypeEnum", {
        get: function () {
            return IFilterable_1.FilterType;
        },
        enumerable: true,
        configurable: true
    });
    ClientAPI.prototype.createFilterCriteria = function (filterType, name, caption, filterItems, isFilterItemsComplex) {
        if (isFilterItemsComplex === void 0) { isFilterItemsComplex = false; }
        return new IFilterable_1.FilterCriteria(filterType, name, caption, filterItems, isFilterItemsComplex);
    };
    Object.defineProperty(ClientAPI.prototype, "binding", {
        get: function () {
            return this._context.binding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientAPI.prototype, "actionResults", {
        get: function () {
            return this.getClientData().actionResults;
        },
        enumerable: true,
        configurable: true
    });
    ClientAPI.prototype.evaluateTargetPath = function (path) {
        return new TargetPathInterpreter_1.TargetPathInterpreter(this._context).evaluateTargetPathForValue(path);
    };
    ClientAPI.prototype.evaluateTargetPathForAPI = function (path) {
        var context = new TargetPathInterpreter_1.TargetPathInterpreter(this._context).evaluateTargetPathForContext(path);
        return context.clientAPI;
    };
    ClientAPI.prototype.formatCurrency = function (value, currencyCode, customLocale, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(value);
        if (!validatedValue) {
            return value.toString();
        }
        var defaultOptions = Object.assign({}, I18nFormatter_1.I18nFormatter.currencyOptions);
        defaultOptions.currency = currencyCode;
        var selectedLocale;
        if (typeof customLocale === 'string' && customLocale !== '' && customLocale !== undefined) {
            selectedLocale = customLocale;
        }
        var options = I18nFormatter_1.I18nFormatter.parseFormatOptions(defaultOptions, customOptions);
        return I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, selectedLocale);
    };
    ClientAPI.prototype.formatDate = function (date, customLocale, customTimeZone, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateDate(date);
        if (!validatedValue) {
            return date.toString();
        }
        return I18nFormatter_1.I18nFormatter.formatDateToLocaleString(validatedValue, 'D', customLocale, customTimeZone, customOptions);
    };
    ClientAPI.prototype.formatDatetime = function (date, customLocale, customTimeZone, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateDate(date);
        if (!validatedValue) {
            return date.toString();
        }
        return I18nFormatter_1.I18nFormatter.formatDateToLocaleString(validatedValue, 'DT', customLocale, customTimeZone, customOptions);
    };
    ClientAPI.prototype.formatNumber = function (value, customLocale, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(value);
        if (!validatedValue) {
            return value.toString();
        }
        var selectedLocale;
        if (typeof customLocale === 'string' && customLocale !== '' && customLocale !== undefined) {
            selectedLocale = customLocale;
        }
        var options = I18nFormatter_1.I18nFormatter.parseFormatOptions(Object.assign({}, I18nFormatter_1.I18nFormatter.numberOptions), customOptions);
        return I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, selectedLocale);
    };
    ClientAPI.prototype.formatPercentage = function (value, customLocale, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(value);
        if (!validatedValue) {
            return value.toString();
        }
        var selectedLocale;
        if (typeof customLocale === 'string' && customLocale !== '' && customLocale !== undefined) {
            selectedLocale = customLocale;
        }
        var options = I18nFormatter_1.I18nFormatter.parseFormatOptions(Object.assign({}, I18nFormatter_1.I18nFormatter.percentageOptions), customOptions);
        return I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, selectedLocale);
    };
    ClientAPI.prototype.formatScientific = function (value, customLocale, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(value);
        if (!validatedValue) {
            return value.toString();
        }
        var selectedLocale;
        if (typeof customLocale === 'string' && customLocale !== '' && customLocale !== undefined) {
            selectedLocale = customLocale;
        }
        var options = I18nFormatter_1.I18nFormatter.parseFormatOptions(Object.assign({}, I18nFormatter_1.I18nFormatter.scientificOptions), customOptions);
        return I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, selectedLocale);
    };
    ClientAPI.prototype.formatTime = function (date, customLocale, customTimeZone, customOptions) {
        var validatedValue = I18nFormatter_1.I18nFormatter.validateDate(date);
        if (!validatedValue) {
            return date.toString();
        }
        return I18nFormatter_1.I18nFormatter.formatDateToLocaleString(validatedValue, 'T', customLocale, customTimeZone, customOptions);
    };
    ClientAPI.prototype.base64StringToBinary = function (base64) {
        if (base64 && base64.length > 0) {
            return IDataService_1.IDataService.instance().base64StringToBinary(base64);
        }
        else {
            Promise.resolve(base64);
        }
    };
    ClientAPI.prototype.formatBase64String = function (base64, contentType) {
        var prefix = "data:" + contentType + ";base64,";
        return prefix + base64.replace(/-/g, '+').replace(/_/g, '/');
    };
    ClientAPI.prototype.getBindingObject = function () {
        return this.binding;
    };
    ClientAPI.prototype.getReadLink = function (path) {
        if (!path) {
            return this._context.readLink;
        }
        else {
            return EvaluateTarget_1.asReadLink(new TargetPathInterpreter_1.TargetPathInterpreter(this._context).evaluateTargetPathForValue(path));
        }
    };
    ClientAPI.prototype.initializeLogger = function (fileName, maxFileSize) {
        if (fileName === void 0) { fileName = undefined; }
        if (maxFileSize === void 0) { maxFileSize = undefined; }
        mdk_sap_1.LoggerManager.init(fileName, maxFileSize);
    };
    ClientAPI.prototype.getLogger = function () {
        return mdk_sap_1.LoggerManager.getInstance();
    };
    ClientAPI.prototype.executeAction = function (actionPath) {
        var eventHandler = new EventHandler_1.EventHandler();
        if (this._context.clientAPIProps && this._context.clientAPIProps.eventSource) {
            eventHandler.setEventSource(this._context.clientAPIProps.eventSource);
        }
        return eventHandler.executeAction(actionPath);
    };
    ClientAPI.prototype.updateProgressBanner = function (message) {
        if (ProgressBannerAction_1.ProgressBannerAction.activeProgressBannerAction()) {
            ProgressBannerAction_1.ProgressBannerAction.activeProgressBannerAction().updateProgressBanner(message);
        }
    };
    ClientAPI.prototype.isMediaLocal = function (serviceName, entitySet, readLink) {
        var target = new TargetServiceBuilder_1.TargetServiceBuilder().entitySet(entitySet)
            .readLink(readLink)
            .serviceName(serviceName)
            .build();
        return IDataService_1.IDataService.instance().isMediaLocal(target);
    };
    ClientAPI.prototype.read = function (serviceName, entitySet, properties, queryOptions, headers, requestOptions) {
        var target;
        try {
            target = new TargetServiceBuilder_1.TargetServiceBuilder().entitySet(entitySet)
                .queryOptions(queryOptions)
                .properties(properties)
                .serviceName(serviceName)
                .requestOptions(requestOptions)
                .headers(headers)
                .build();
        }
        catch (error) {
            Logger_1.Logger.instance.api.error(error);
            return Promise.reject(error);
        }
        if (target.queryOptions && !target.offlineEnabled) {
            var decodedQueryOptions = decodeURI(target.queryOptions);
            if (decodedQueryOptions === target.queryOptions) {
                target.queryOptions = encodeURI(decodedQueryOptions);
            }
        }
        return EvaluateTarget_1.asHeaders(target.headers, this._context).then(function (resolvedHeaders) {
            target.headers = resolvedHeaders;
            return IDataService_1.IDataService.instance().read(target);
        });
    };
    ClientAPI.prototype.callFunction = function (serviceName, oFunction, headers) {
        var target = new TargetServiceBuilder_1.TargetServiceBuilder()
            .function(oFunction)
            .serviceName(serviceName)
            .build();
        return EvaluateTarget_1.asHeaders(target.headers, this._context).then(function (resolvedHeaders) {
            target.headers = resolvedHeaders;
            return IDataService_1.IDataService.instance().callFunction(target, resolvedHeaders);
        });
    };
    ClientAPI.prototype.create = function (serviceName, entitySet, properties, createLinks, headers, requestOptions) {
        var target = new TargetServiceBuilder_1.TargetServiceBuilder().entitySet(entitySet)
            .properties(properties)
            .serviceName(serviceName)
            .headers(headers)
            .requestOptions(requestOptions)
            .build();
        var links = [];
        for (var _i = 0, createLinks_1 = createLinks; _i < createLinks_1.length; _i++) {
            var createLink = createLinks_1[_i];
            links.push({
                entitySet: createLink.getEntitySet(),
                property: createLink.getProperty(),
                queryOptions: createLink.getQueryOptions(),
                readLink: createLink.getReadLink(),
            });
        }
        return EvaluateTarget_1.asHeaders(target.headers, this._context).then(function (resolvedHeaders) {
            target.headers = resolvedHeaders;
            return IDataService_1.IDataService.instance().create(target, links, resolvedHeaders);
        });
    };
    ClientAPI.prototype.getGlobalDefinition = function (globalPath) {
        try {
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(globalPath);
        }
        catch (error) {
            Logger_1.Logger.instance.api.error(error);
        }
    };
    ClientAPI.prototype.getCircularImage = function (base64EncodedImageStr) {
        var base64EncodedImageData;
        var fileExtension;
        var imgbase64String;
        var base64EncodedImageSubstr = base64EncodedImageStr.split(',');
        if (base64EncodedImageSubstr.length > 1) {
            base64EncodedImageData = base64EncodedImageSubstr[1];
        }
        else {
            return undefined;
        }
        var imageSource = image_source_1.ImageSource.fromBase64Sync(base64EncodedImageData);
        var circularImage = mdk_sap_1.NativeImages.getInstance().getCircularImage(imageSource);
        imageSource = image_source_1.fromNativeSource(circularImage);
        fileExtension = 'png';
        imgbase64String = PNG_BASE64_PREFIX + imageSource.toBase64String(fileExtension);
        return imgbase64String;
    };
    ClientAPI.prototype.getIconTextImage = function (iconText, width, height, isCircular, stylesJSON) {
        var iconTextImage;
        var iconTextInitials = ImageHelper_1.ImageHelper.getIconTextInitials(iconText);
        iconTextImage = mdk_sap_1.NativeImages.getInstance().getIconTextImage(iconTextInitials, width, height, stylesJSON, 1);
        var imageSource = image_source_1.fromNativeSource(iconTextImage);
        if (isCircular) {
            iconTextImage = mdk_sap_1.NativeImages.getInstance().getCircularImage(imageSource);
        }
        imageSource = image_source_1.fromNativeSource(iconTextImage);
        var imgbase64String = PNG_BASE64_PREFIX + imageSource.toBase64String('png');
        return imgbase64String;
    };
    ClientAPI.prototype.getPendingDownload = function (page) {
        var pendingData = AppSettingsManager_1.AppSettingsManager.instance().getPendingDataForPage(page);
        if (pendingData) {
            return JSON.parse(pendingData.data);
        }
        return undefined;
    };
    ClientAPI.prototype.getDefinitionValue = function (target) {
        try {
            return ValueResolver_1.ValueResolver.resolveValue(target, this._context);
        }
        catch (error) {
            Logger_1.Logger.instance.api.error(error);
        }
    };
    ClientAPI.prototype.getClientData = function () {
        return this._context.clientData;
    };
    ClientAPI.prototype.getAppEventData = function () {
        return this._clientAPIProps().appEventData;
    };
    ClientAPI.prototype.getActionResult = function (key) {
        return this.getClientData().actionResults[key];
    };
    ClientAPI.prototype.getLanguage = function () {
        var appLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        if (appLanguage === I18nLanguage_1.I18nLanguage.defaultI18n) {
            appLanguage = I18nLanguage_1.I18nLanguage.hardcodedLanguageCode;
        }
        return appLanguage;
    };
    ClientAPI.prototype.getRegion = function () {
        return ClientSettings_1.ClientSettings.getAppRegion();
    };
    ClientAPI.prototype.getSupportedLanguages = function () {
        var i18nSupportedLanguagesObj = I18nLanguage_1.I18nLanguage.getSupportedLanguages();
        if (i18nSupportedLanguagesObj) {
            return i18nSupportedLanguagesObj;
        }
        return new Object();
    };
    ClientAPI.prototype.getRegions = function () {
        var i18nRegionObj = I18nRegion_1.I18nRegion.getRegionLists();
        if (i18nRegionObj) {
            return i18nRegionObj;
        }
        return new Object();
    };
    ClientAPI.prototype.isDemoMode = function () {
        return ClientSettings_1.ClientSettings.isDemoMode();
    };
    ClientAPI.prototype.isAppInMultiUserMode = function () {
        return mdk_sap_1.WelcomeScreenBridge.getInstance().isAppInMultiUserMode();
    };
    ClientAPI.prototype.localizeText = function (key, dynamicParams) {
        return I18nHelper_1.I18nHelper.localizeDefinitionText(key, dynamicParams, this._context);
    };
    ClientAPI.prototype.count = function (serviceName, entitySet, queryOptions, headers, requestOptions) {
        var _this = this;
        var target = new TargetServiceBuilder_1.TargetServiceBuilder().entitySet(entitySet)
            .queryOptions(queryOptions)
            .serviceName(serviceName)
            .requestOptions(requestOptions)
            .headers(headers)
            .build();
        return EvaluateTarget_1.asHeaders(target.headers, this._context).then(function (resolvedHeaders) {
            target.headers = resolvedHeaders;
            return IDataService_1.IDataService.instance().count(target, _this._context).catch(function (err) {
                return Promise.resolve(0);
            });
        });
    };
    ClientAPI.prototype.createLinkSpecifierProxy = function (property, entitySet, queryOptions, readLink) {
        return new LinkSpecifierProxy(property, entitySet, queryOptions, readLink);
    };
    ClientAPI.prototype.downloadInProgressForReadLink = function (readLink) {
        var pendingData = AppSettingsManager_1.AppSettingsManager.instance().getPendingDataForKey(readLink);
        if (pendingData) {
            return pendingData.type === AppSettingsManager_1.AppSettingsManager.pendingType.Download;
        }
        return false;
    };
    ClientAPI.prototype.downloadInProgressForPage = function (page) {
        var pendingData = AppSettingsManager_1.AppSettingsManager.instance().getPendingDataForPage(page);
        if (pendingData) {
            return pendingData.type === AppSettingsManager_1.AppSettingsManager.pendingType.Download;
        }
        return false;
    };
    ClientAPI.prototype.getPasscodeSource = function () {
        return ClientSettings_1.ClientSettings.getPasscodeSource();
    };
    ClientAPI.prototype.isCurrentPage = function (pageName) {
        var currentPage = this.currentPage;
        return currentPage ? currentPage.definition.name === pageName : false;
    };
    Object.defineProperty(ClientAPI.prototype, "currentPage", {
        get: function () {
            var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
            return topFrame.currentPage;
        },
        enumerable: true,
        configurable: true
    });
    ClientAPI.prototype.dismissActivityIndicator = function (id) {
        mdk_sap_1.ActivityIndicator.instance.dismissWithId(id);
    };
    ClientAPI.prototype.showActivityIndicator = function (text) {
        return mdk_sap_1.ActivityIndicator.instance.show(text);
    };
    ClientAPI.prototype.setApplicationIconBadgeNumber = function (badge) {
        if (application.ios) {
            application.ios.nativeApp.applicationIconBadgeNumber = badge;
        }
    };
    ClientAPI.prototype.setLanguage = function (languageKey) {
        if (typeof languageKey !== 'string' || languageKey === '' || languageKey === undefined) {
            I18nLanguage_1.I18nLanguage.setUserDefinedLanguage('');
        }
        else {
            var i18nSupportedLanguagesObj = I18nLanguage_1.I18nLanguage.getSupportedLanguages();
            if (i18nSupportedLanguagesObj) {
                if (i18nSupportedLanguagesObj.hasOwnProperty(languageKey)) {
                    I18nLanguage_1.I18nLanguage.setUserDefinedLanguage(languageKey);
                }
                else {
                    throw new Error(ErrorMessage_1.ErrorMessage.INVALID_LANGUAGE);
                }
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.FAILED_GET_SUPPORTED_LANGUAGES);
            }
        }
        var params = ClientSettings_1.ClientSettings.getOnboardingCustomizations();
        mdk_sap_1.OnboardingCustomizationBridge.configOnboardingPages(params);
    };
    ClientAPI.prototype.setRegion = function (region) {
        if (typeof region !== 'string' || region === '' || region === undefined) {
            I18nRegion_1.I18nRegion.setUserDefinedRegion('');
        }
        else {
            var i18nRegions = I18nRegion_1.I18nRegion.getRegionLists();
            if (i18nRegions) {
                if (i18nRegions.hasOwnProperty(region)) {
                    I18nRegion_1.I18nRegion.setUserDefinedRegion(region);
                }
                else {
                    throw new Error(ErrorMessage_1.ErrorMessage.INVALID_REGION);
                }
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.FAILED_SET_REGIONS);
            }
        }
    };
    ClientAPI.prototype.getAvailableThemes = function () {
        return StyleHelper_1.StyleHelper.getAvailableThemes();
    };
    ClientAPI.prototype.getTheme = function () {
        return StyleHelper_1.StyleHelper.getTheme();
    };
    ClientAPI.prototype.setTheme = function (newTheme) {
        var result = StyleHelper_1.StyleHelper.setTheme(newTheme);
        if (!result) {
            throw new Error(ErrorMessage_1.ErrorMessage.INVALID_THEME);
        }
        return result;
    };
    ClientAPI.prototype.getVersionInfo = function () {
        return mdk_sap_1.VersionInfoBridge.getVersionInfo();
    };
    ClientAPI.prototype.sendRequest = function (path, params) {
        var invalidMsg = null;
        if (path && path.constructor === String) {
            if (path.startsWith('http://') || path.startsWith('https://')) {
                invalidMsg = 'path should be relative path to mobile service destination, not a URL.';
            }
        }
        else {
            invalidMsg = 'path is required and should be a string';
        }
        if (invalidMsg) {
            return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_REQUEST, invalidMsg)));
        }
        if (params) {
            if (params.constructor === Object) {
                var methodKey = 'method';
                var bodyKey = 'body';
                var headerKey_1 = 'header';
                var methodSet = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'CONNECT', 'OPTIONS', 'TRACE'];
                if (params.hasOwnProperty(methodKey)) {
                    if (params[methodKey].constructor !== String || methodSet.indexOf(params[methodKey]) < 0) {
                        invalidMsg = '\'' + methodKey + '\' in params should be a string of methods as HTTP specification.';
                    }
                }
                if (params.hasOwnProperty(headerKey_1)) {
                    if (params[headerKey_1].constructor !== Object) {
                        invalidMsg = '\'' + headerKey_1 + '\' in params should be a object.';
                    }
                    else {
                        Object.keys(params[headerKey_1]).forEach(function (key) {
                            if (params[headerKey_1][key].constructor !== String) {
                                invalidMsg = '\'' + key + '\' of \'' + headerKey_1 + '\' in params should be a string.';
                            }
                        });
                    }
                }
            }
            else {
                invalidMsg = 'params should be a object.';
            }
            if (invalidMsg) {
                return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_REQUEST, invalidMsg)));
            }
        }
        var requestPath = path.startsWith('/') ? path : '/' + path;
        var url = ClientSettings_1.ClientSettings.getCpmsUrl() + requestPath;
        return mdk_sap_1.CpmsSession.getInstance().sendRequest(url, params).then(function (responseAndData) {
            var headers = mdk_sap_1.HttpResponse.getHeaders(responseAndData);
            var mimeType = mdk_sap_1.HttpResponse.getMimeType(responseAndData);
            var statusCode = mdk_sap_1.HttpResponse.getStatusCode(responseAndData);
            var content = new HttpResponseContentProxy(url, responseAndData);
            return new HttpResponseProxy(headers, mimeType, statusCode, content);
        });
    };
    ClientAPI.prototype.sendMobileServiceRequest = function (path, params) {
        return this.sendRequest.apply(this, arguments);
    };
    ClientAPI.prototype.getMobileServiceEndpointUrl = function () {
        return ClientSettings_1.ClientSettings.getCpmsUrl();
    };
    ClientAPI.prototype.getMobileServiceAppId = function () {
        return ClientSettings_1.ClientSettings.getAppId();
    };
    ClientAPI.prototype.getSAPPassportHeaderValue = function (componentName, action, traceFlag, componentType, prevComponentName, userId) {
        return mdk_sap_1.Passport.getHeaderValue(componentName, action, traceFlag, componentType, prevComponentName, userId);
    };
    ClientAPI.prototype.getODataProvider = function (serviceName) {
        if (IDataService_1.IDataService.instance().offlineEnabled(serviceName)) {
            return new OfflineDataProviderProxy(serviceName);
        }
        else {
            return new ODataProviderProxy(serviceName);
        }
    };
    ClientAPI.prototype._clientAPIProps = function () {
        return this._context.clientAPIProps;
    };
    return ClientAPI;
}());
exports.ClientAPI = ClientAPI;
var ControlProxy = (function (_super) {
    __extends(ControlProxy, _super);
    function ControlProxy(context) {
        var _this = _super.call(this, context) || this;
        _this._control = context.element;
        return _this;
    }
    ControlProxy.prototype.applyValidation = function () {
        this._control.redraw();
    };
    ControlProxy.prototype.clearValidation = function () {
        this._control.clearValidation();
    };
    ControlProxy.prototype.clearValidationOnValueChange = function () {
        this._control.clearValidationOnValueChange();
    };
    ControlProxy.prototype.getCaption = function () {
        var caption = '';
        if (this._control.definition().getCaption) {
            caption = this._control.definition().getCaption();
        }
        return caption;
    };
    ControlProxy.prototype.getName = function () {
        return this._control.definition().getName();
    };
    ControlProxy.prototype.getPageProxy = function () {
        return this._control.page().context.clientAPI;
    };
    ControlProxy.prototype.getType = function () {
        return this._control.definition().getType();
    };
    ControlProxy.prototype.getValue = function () {
        return this._control.getValue();
    };
    ControlProxy.prototype.isContainer = function () {
        return false;
    };
    ControlProxy.prototype.redraw = function () {
        this._control.redraw();
    };
    ControlProxy.prototype.setEditable = function (value) {
        this._control.setEditable(value);
        return this;
    };
    ControlProxy.prototype.setStyle = function (styleClass, subView) {
        if (subView === '') {
            this._control.setStyle(styleClass, 'Background');
        }
        else {
            this._control.setStyle(styleClass, subView);
        }
        return this;
    };
    ControlProxy.prototype.setValidationProperty = function (key, value) {
        this._control.setValidationProperty(key, value);
        return this;
    };
    ControlProxy.prototype.setValue = function (value, notify) {
        if (notify === void 0) { notify = true; }
        this._control.setValue(value, notify, true);
        return this;
    };
    ControlProxy.prototype.setVisible = function (value, redraw) {
        if (redraw === void 0) { redraw = true; }
        this._control.setVisible(value, redraw);
        return this;
    };
    return ControlProxy;
}(ClientAPI));
exports.ControlProxy = ControlProxy;
var FormCellContainerProxy = (function (_super) {
    __extends(FormCellContainerProxy, _super);
    function FormCellContainerProxy(context) {
        var _this = _super.call(this, context) || this;
        _this._container = _this._context.element;
        return _this;
    }
    FormCellContainerProxy.prototype.getCaption = function () {
        var caption = '';
        if (this._container.definition().geCaption) {
            caption = this._container.definition().geCaption();
        }
        return caption;
    };
    FormCellContainerProxy.prototype.getControl = function (name) {
        var matchingControl = this._container.controls.find(function (control) {
            return control.definition().getName() === name;
        });
        if (matchingControl) {
            return matchingControl.context.clientAPI;
        }
    };
    FormCellContainerProxy.prototype.getControls = function () {
        return this._container.controls.map(function (control) {
            return control.context.clientAPI;
        });
    };
    FormCellContainerProxy.prototype.isContainer = function () {
        return true;
    };
    return FormCellContainerProxy;
}(ControlProxy));
exports.FormCellContainerProxy = FormCellContainerProxy;
var TargetProxy = (function () {
    function TargetProxy(specifier) {
        this._serverSidePaging = false;
        this._specifier = specifier;
        if (this._specifier.Target) {
            this._entitySet = this._specifier.Target.EntitySet;
            this._queryOptions = this._specifier.Target.QueryOptions;
            this._service = this._specifier.Target.Service;
            this._function = this._specifier.Target.Function;
            if (this._specifier.Target.ServerSidePaging) {
                this._serverSidePaging = this._specifier.Target.ServerSidePaging;
            }
            this._outputPath = this._specifier.Target.OutputPath;
            this._path = this._specifier.Target.Path;
            this._requestProperties = this._specifier.Target.RequestProperties;
            this._readLink = this._specifier.Target.ReadLink;
        }
    }
    Object.defineProperty(TargetProxy.prototype, "specifier", {
        get: function () {
            return this._specifier;
        },
        enumerable: true,
        configurable: true
    });
    TargetProxy.prototype.getEntitySet = function () {
        return this._entitySet;
    };
    TargetProxy.prototype.getFunction = function () {
        return this._function;
    };
    TargetProxy.prototype.getOutputPath = function () {
        return this._outputPath;
    };
    TargetProxy.prototype.getPath = function () {
        return this._path;
    };
    TargetProxy.prototype.getReadLink = function () {
        return this._path;
    };
    TargetProxy.prototype.getRequestProperties = function () {
        return this._requestProperties;
    };
    TargetProxy.prototype.getQueryOptions = function () {
        return this._queryOptions;
    };
    TargetProxy.prototype.getServerSidePaging = function () {
        return this._serverSidePaging;
    };
    TargetProxy.prototype.getService = function () {
        return this._service;
    };
    TargetProxy.prototype.setEntitySet = function (value) {
        this._entitySet = value;
        return this;
    };
    TargetProxy.prototype.setFunction = function (value) {
        if (typeof (value) === 'object' && value.hasOwnProperty('Name')) {
            this._function = value;
        }
        return this;
    };
    TargetProxy.prototype.setOutputPath = function (value) {
        this._outputPath = value;
        return this;
    };
    TargetProxy.prototype.setPath = function (value) {
        this._path = value;
        return this;
    };
    TargetProxy.prototype.setQueryOptions = function (value) {
        this._queryOptions = value;
        return this;
    };
    TargetProxy.prototype.setReadLink = function (value) {
        this._readLink = value;
        return this;
    };
    TargetProxy.prototype.setRequestProperties = function (value) {
        this._requestProperties = value;
        return this;
    };
    TargetProxy.prototype.setServerSidePaging = function (value) {
        this._serverSidePaging = value;
        return this;
    };
    TargetProxy.prototype.setService = function (value) {
        this._service = value;
        return this;
    };
    return TargetProxy;
}());
exports.TargetProxy = TargetProxy;
var FormCellTargetProxy = (function (_super) {
    __extends(FormCellTargetProxy, _super);
    function FormCellTargetProxy(specifier) {
        var _this = _super.call(this, specifier) || this;
        _this._displayValue = _this._specifier.DisplayValue;
        _this._returnValue = _this._specifier.ReturnValue;
        return _this;
    }
    FormCellTargetProxy.prototype.getDisplayValue = function () {
        return this._displayValue;
    };
    FormCellTargetProxy.prototype.getReturnValue = function () {
        return this._returnValue;
    };
    FormCellTargetProxy.prototype.setDisplayValue = function (value) {
        this._displayValue = value;
        return this;
    };
    FormCellTargetProxy.prototype.setReturnValue = function (value) {
        this._returnValue = value;
        return this;
    };
    return FormCellTargetProxy;
}(TargetProxy));
exports.FormCellTargetProxy = FormCellTargetProxy;
var ListPickerFormCellTargetProxy = (function (_super) {
    __extends(ListPickerFormCellTargetProxy, _super);
    function ListPickerFormCellTargetProxy(specifier) {
        var _this = _super.call(this, specifier) || this;
        _this._objectCell = specifier.ObjectCell;
        return _this;
    }
    ListPickerFormCellTargetProxy.prototype.getObjectCell = function () {
        return this._objectCell;
    };
    ListPickerFormCellTargetProxy.prototype.setObjectCell = function (value) {
        this._objectCell = value;
        return this;
    };
    return ListPickerFormCellTargetProxy;
}(FormCellTargetProxy));
exports.ListPickerFormCellTargetProxy = ListPickerFormCellTargetProxy;
var FormCellControlProxy = (function (_super) {
    __extends(FormCellControlProxy, _super);
    function FormCellControlProxy(context) {
        return _super.call(this, context) || this;
    }
    FormCellControlProxy.prototype.dataQueryBuilder = function (query) {
        if (query === void 0) { query = undefined; }
        this._dataQueryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this._context, query);
        return this._dataQueryBuilder;
    };
    Object.defineProperty(FormCellControlProxy.prototype, "searchString", {
        get: function () {
            return this._control.searchString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellControlProxy.prototype, "visible", {
        get: function () {
            return this._control.visible;
        },
        set: function (visible) {
            this._control.visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    FormCellControlProxy.prototype.createAttachmentEntry = function (attachmentPath, entitySet, property, readLink, service, encodeURI) {
        if (encodeURI === void 0) { encodeURI = true; }
        try {
            if (fileSystem.File.exists(attachmentPath)) {
                var urlString = attachmentPath;
                if (encodeURI) {
                    urlString = "file://" + attachmentPath;
                }
                if (this._isValidAttachment(attachmentPath)) {
                    return {
                        entitySet: entitySet,
                        property: property,
                        readLink: readLink,
                        service: service,
                        urlString: urlString,
                    };
                }
            }
        }
        catch (error) {
            Logger_1.Logger.instance.api.error(error);
        }
        return undefined;
    };
    FormCellControlProxy.prototype.getTargetSpecifier = function () {
        return new FormCellTargetProxy(this._control.getTargetSpecifier());
    };
    FormCellControlProxy.prototype.setTargetSpecifier = function (specifier, redraw) {
        if (!specifier.getDisplayValue() || (!specifier.getEntitySet() && !specifier.getFunction()) ||
            !specifier.getService()) {
            var error = 'Invalid call to setItemSpecifier missing required properties\n';
            if (specifier.getDisplayValue()) {
                error += "displayValue " + specifier.getDisplayValue();
            }
            if (specifier.getEntitySet()) {
                error += "entitySet " + specifier.getEntitySet();
            }
            if (specifier.getFunction()) {
                error += "function " + specifier.getFunction();
            }
            if (specifier.getService()) {
                error += "service " + specifier.getService();
            }
            throw new Error(error);
        }
        return this._control.setTargetSpecifier(specifier, redraw);
    };
    FormCellControlProxy.prototype.getCollection = function () {
        return this._control.getCollection();
    };
    FormCellControlProxy.prototype.setFocus = function (keyboardVisibility) {
        this._control.setFocus(keyboardVisibility);
    };
    FormCellControlProxy.prototype._isValidAttachment = function (attachmentPath) {
        var attachmentFileObject = fileSystem.File.fromPath(attachmentPath);
        var extension = attachmentFileObject.extension;
        if (this.getClientData().DeletedAttachments) {
            var deletedAttachments = this.getClientData().DeletedAttachments.filter(function (deletedAttachment) {
                return deletedAttachment.urlString.includes(attachmentFileObject.name);
            });
            return deletedAttachments.length === 0 && (extension === '.jpeg' || extension === '.jpg');
        }
        return true;
    };
    return FormCellControlProxy;
}(ControlProxy));
exports.FormCellControlProxy = FormCellControlProxy;
var ListPickerFormCellProxy = (function (_super) {
    __extends(ListPickerFormCellProxy, _super);
    function ListPickerFormCellProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerFormCellProxy.prototype.getTargetSpecifier = function () {
        return new ListPickerFormCellTargetProxy(this._control.getTargetSpecifier());
    };
    ListPickerFormCellProxy.prototype.setTargetSpecifier = function (specifier, redraw) {
        if (specifier instanceof ListPickerFormCellTargetProxy) {
            var lpSpecifier = specifier;
            if (!(lpSpecifier.getDisplayValue() || (lpSpecifier.getObjectCell && lpSpecifier.getObjectCell()))
                || (!lpSpecifier.getEntitySet() && !lpSpecifier.getFunction())
                || !lpSpecifier.getService()) {
                var error = 'Invalid call to setItemSpecifier missing required properties\n';
                if (lpSpecifier.getDisplayValue()) {
                    error += "displayValue " + lpSpecifier.getDisplayValue();
                }
                if (lpSpecifier.getObjectCell && lpSpecifier.getObjectCell()) {
                    error += "objectCell " + JSON.stringify(lpSpecifier.getObjectCell());
                }
                if (lpSpecifier.getEntitySet()) {
                    error += " entitySet " + lpSpecifier.getEntitySet();
                }
                if (lpSpecifier.getFunction()) {
                    error += " function " + lpSpecifier.getFunction();
                }
                if (lpSpecifier.getService()) {
                    error += " service " + lpSpecifier.getService();
                }
                throw new Error(error);
            }
            return this._control.setTargetSpecifier(specifier, redraw);
        }
        return _super.prototype.setTargetSpecifier.call(this, specifier, redraw);
    };
    return ListPickerFormCellProxy;
}(FormCellControlProxy));
exports.ListPickerFormCellProxy = ListPickerFormCellProxy;
var PageProxy = (function (_super) {
    __extends(PageProxy, _super);
    function PageProxy(context) {
        var _this = _super.call(this, context) || this;
        _this._page = _this._context.element;
        return _this;
    }
    PageProxy.prototype.getActionBinding = function () {
        return this._context.clientAPIProps.actionBinding;
    };
    PageProxy.prototype.getCaption = function () {
        var caption = '';
        if (typeof this._page.definition.getCaption === 'function') {
            caption = this._page.definition.getCaption();
        }
        return caption;
    };
    PageProxy.prototype.getGlobalSideDrawerControlProxy = function () {
        var appLevelSideDrawer = this._page.getAppLevelSideDrawer();
        return appLevelSideDrawer !== undefined ? appLevelSideDrawer.context.clientAPI : undefined;
    };
    PageProxy.prototype.getControl = function (name) {
        var matchingControl = this._page.controls.find(function (control) {
            return control.definition().getName() === name;
        });
        if (matchingControl) {
            return matchingControl.context.clientAPI;
        }
    };
    PageProxy.prototype.getControls = function () {
        return this._page.controls.map(function (control) {
            return control.context.clientAPI;
        });
    };
    PageProxy.prototype.getMissingRequiredControls = function () {
        return this._clientAPIProps().missingRequiredControls ? this._clientAPIProps().missingRequiredControls : [];
    };
    PageProxy.prototype.getPressedItem = function () {
        return this._clientAPIProps().pressedItem;
    };
    PageProxy.prototype.getExecutedContextMenuItem = function () {
        return this._clientAPIProps().contextItem;
    };
    PageProxy.prototype.setActionBinding = function (binding) {
        this._clientAPIProps().actionBinding = binding;
        return this;
    };
    PageProxy.prototype.setCaption = function (caption) {
        this._page.caption = caption;
    };
    PageProxy.prototype.redraw = function () {
        this._page.redraw();
    };
    PageProxy.prototype.setStyle = function (styleClass, subControl) {
        if (subControl === void 0) { subControl = ''; }
        if (subControl === '') {
            this._page.className = styleClass;
        }
        else if (subControl === 'ActionBar') {
            this._page.actionBar.className = styleClass;
        }
        else if (subControl === 'ToolBar') {
            this._page.getToolbar().then(function (toolbar) {
                toolbar.setStyle(styleClass);
            });
        }
        return this;
    };
    PageProxy.prototype.setActionBarItemVisible = function (item, visibleFlag) {
        var items = this._page.actionBar.actionItems.getItems();
        var index = this._page.hasHamburgerActionItem ? item + 1 : item;
        if (index >= 0 && index < items.length) {
            if (application.android) {
                if ((index === 0) && this._page.isModal() && this._page.actionBar.navigationButton) {
                    this._page.actionBar.navigationButton.visibility = visibleFlag ? 'visible' : 'collapse';
                    return;
                }
                else {
                    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                        var actionBarItem = items_1[_i];
                        if (actionBarItem.orgIndex === index) {
                            actionBarItem.visibility = visibleFlag ? 'visible' : 'collapse';
                            return;
                        }
                    }
                }
            }
            else {
                items[index].visibility = visibleFlag ? 'visible' : 'collapse';
            }
        }
    };
    PageProxy.prototype.setToolbarItemCaption = function (toolbarItemName, newCaption) {
        var _this = this;
        return this._page.getToolbar().then(function (toolbar) {
            var result = Promise.resolve();
            if (toolbar) {
                result = toolbar.setItemCaption(toolbarItemName, newCaption);
            }
            else {
                Logger_1.Logger.instance.api.warn(Logger_1.Logger.SETTOOLBARITEMCAPTION_TOOLBAR_NOT_FOUND, _this._page.definition.getCaption());
            }
            return result;
        });
    };
    PageProxy.prototype.getPageProxy = function () {
        return this;
    };
    return PageProxy;
}(ClientAPI));
exports.PageProxy = PageProxy;
var SectionedTableProxy = (function (_super) {
    __extends(SectionedTableProxy, _super);
    function SectionedTableProxy(context) {
        return _super.call(this, context) || this;
    }
    SectionedTableProxy.prototype.isContainer = function () {
        return true;
    };
    SectionedTableProxy.prototype.dataQueryBuilder = function (query) {
        if (query === void 0) { query = undefined; }
        this._dataQueryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this._context, query);
        return this._dataQueryBuilder;
    };
    SectionedTableProxy.prototype.getSections = function () {
        return this.sections;
    };
    Object.defineProperty(SectionedTableProxy.prototype, "sections", {
        get: function () {
            this._sections = this._sections || this._control._sections.map(function (section) {
                if (section.isSelectable) {
                    return new SelectableSectionProxy(new Context_1.Context(section.binding, section));
                }
                else if (section.isBindable) {
                    return new BindableSectionProxy(new Context_1.Context(section.binding, section));
                }
                else {
                    return new SectionProxy(new Context_1.Context(section.binding, section));
                }
            });
            return this._sections;
        },
        enumerable: true,
        configurable: true
    });
    SectionedTableProxy.prototype.getSection = function (name) {
        var matchingSection = this.sections.find(function (section) {
            return section.getName() === name;
        });
        return matchingSection;
    };
    Object.defineProperty(SectionedTableProxy.prototype, "searchString", {
        get: function () {
            if (this.sections.length > 0) {
                return this.sections[0].searchString;
            }
            return '';
        },
        set: function (searchText) {
            this._control.setSearchText(searchText);
        },
        enumerable: true,
        configurable: true
    });
    SectionedTableProxy.prototype.getControl = function (name) {
        var control = null;
        var formCellSections = this._control._sections.filter(function (section) {
            return section.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection;
        });
        formCellSections.forEach(function (section) {
            var matchingControl = section.controls.find(function (control) {
                return control.definition().getName() === name;
            });
            if (matchingControl) {
                control = matchingControl.context.clientAPI;
            }
        });
        return control;
    };
    SectionedTableProxy.prototype.getControls = function () {
        var controls = [];
        this._control._sections.forEach(function (section) {
            if (section.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection) {
                section.controls.forEach(function (control) {
                    controls.push(control.context.clientAPI);
                });
            }
        });
        return controls;
    };
    return SectionedTableProxy;
}(ControlProxy));
exports.SectionedTableProxy = SectionedTableProxy;
var SectionProxy = (function (_super) {
    __extends(SectionProxy, _super);
    function SectionProxy(context) {
        return _super.call(this, context) || this;
    }
    SectionProxy.prototype.getExtensions = function () {
        return this._context.element.extensions;
    };
    SectionProxy.prototype.getPageProxy = function () {
        return this._context.element.table.page().context.clientAPI;
    };
    SectionProxy.prototype.getName = function () {
        return this._context.element.definition.name;
    };
    SectionProxy.prototype.getProperty = function () {
        return this._context.clientAPIProps.bindingProperty;
    };
    SectionProxy.prototype.getType = function () {
        return this._context.element.definition.type;
    };
    SectionProxy.prototype.isStaticSection = function () {
        return this._context.element.staticSection;
    };
    SectionProxy.prototype.setIndicatorState = function (newState, pressedItem) {
        return this._context.element.setIndicatorState(newState, pressedItem);
    };
    Object.defineProperty(SectionProxy.prototype, "searchString", {
        get: function () {
            return this._context.element.searchString;
        },
        enumerable: true,
        configurable: true
    });
    SectionProxy.prototype.getControl = function (name) {
        if (this._context.element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection) {
            var matchingControl = this._context.element.controls.find(function (control) {
                return control.definition().getName() === name;
            });
            if (matchingControl) {
                return matchingControl.context.clientAPI;
            }
        }
    };
    SectionProxy.prototype.getControls = function () {
        if (this._context.element.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection) {
            return this._context.element.controls.map(function (control) {
                return control.context.clientAPI;
            });
        }
        else {
            return [];
        }
    };
    SectionProxy.prototype.redraw = function () {
        return this._context.element.redraw();
    };
    SectionProxy.prototype.getVisible = function () {
        return this._context.element.visible;
    };
    SectionProxy.prototype.setVisible = function (value, redraw) {
        if (redraw === void 0) { redraw = true; }
        this._context.element.dynamicVisible = value;
        if (redraw) {
            return this._context.element.redraw();
        }
        else {
            return Promise.resolve();
        }
    };
    Object.defineProperty(SectionProxy.prototype, "dataSubscriptions", {
        get: function () {
            return this._context.element.sectionDataSubscriptions;
        },
        set: function (dataSubscriptions) {
            this._context.element.sectionDataSubscriptions = dataSubscriptions;
        },
        enumerable: true,
        configurable: true
    });
    return SectionProxy;
}(ClientAPI));
exports.SectionProxy = SectionProxy;
var BindableSectionProxy = (function (_super) {
    __extends(BindableSectionProxy, _super);
    function BindableSectionProxy(context) {
        return _super.call(this, context) || this;
    }
    BindableSectionProxy.prototype.getTargetSpecifier = function () {
        return new TargetProxy(this._context.element.getTargetSpecifier());
    };
    BindableSectionProxy.prototype.setTargetSpecifier = function (specifier, redraw) {
        if (redraw === void 0) { redraw = true; }
        if (!specifier.getService() || (!specifier.getEntitySet() && !specifier.getFunction())) {
            var error = 'Invalid call to setItemSpecifier missing required properties\n';
            if (specifier.getEntitySet()) {
                error += "entitySet " + specifier.getEntitySet();
            }
            if (specifier.getFunction()) {
                error += "function " + specifier.getFunction();
            }
            if (specifier.getService()) {
                error += "service " + specifier.getService();
            }
            throw new Error(error);
        }
        var specifierProxy = specifier;
        if (!specifierProxy.specifier.Target) {
            specifierProxy.specifier.Target = {};
        }
        specifierProxy.specifier.Target.EntitySet = specifierProxy.getEntitySet();
        specifierProxy.specifier.Target.QueryOptions = specifierProxy.getQueryOptions();
        specifierProxy.specifier.Target.Service = specifierProxy.getService();
        specifierProxy.specifier.Target.Function = specifierProxy.getFunction();
        specifierProxy.specifier.Target.ServerSidePaging = specifierProxy.getServerSidePaging();
        specifierProxy.specifier.Target.OutputPath = specifierProxy.getOutputPath();
        specifierProxy.specifier.Target.Path = specifierProxy.getPath();
        specifierProxy.specifier.Target.RequestProperties = specifierProxy.getRequestProperties();
        specifierProxy.specifier.Target.ReadLink = specifierProxy.getReadLink();
        return this._context.element.setTargetSpecifier(specifierProxy.specifier, redraw);
    };
    return BindableSectionProxy;
}(SectionProxy));
exports.BindableSectionProxy = BindableSectionProxy;
var SelectableSectionProxy = (function (_super) {
    __extends(SelectableSectionProxy, _super);
    function SelectableSectionProxy(context) {
        return _super.call(this, context) || this;
    }
    SelectableSectionProxy.prototype.getSelectedItems = function () {
        return this._context.element.getSelectedItems();
    };
    SelectableSectionProxy.prototype.setSelectionMode = function (mode) {
        return this._context.element.setSelectionMode(mode);
    };
    SelectableSectionProxy.prototype.getSelectionMode = function () {
        return this._context.element.getSelectionMode();
    };
    SelectableSectionProxy.prototype.getSelectionChangedItem = function () {
        return this._context.element.getSelectionChangedItem();
    };
    return SelectableSectionProxy;
}(BindableSectionProxy));
exports.SelectableSectionProxy = SelectableSectionProxy;
var LinkSpecifierProxy = (function () {
    function LinkSpecifierProxy(property, entitySet, queryOptions, readLink) {
        if (!property || !entitySet || !queryOptions && !readLink) {
            var error = 'Invalid call to LinkSpecifierProxy missing required properties\n';
            error += "property " + property;
            error += "entitySet " + entitySet;
            error += "queryOptions " + queryOptions;
            error += "readLink " + readLink;
            throw new Error(error);
        }
        this._property = property;
        this._entitySet = entitySet;
        this._queryOptions = queryOptions ? queryOptions : '';
        this._readLink = readLink ? readLink : '';
    }
    LinkSpecifierProxy.prototype.getSpecifier = function () {
        var target = { EntitySet: this._entitySet, QueryOptions: this._queryOptions, ReadLink: this._readLink };
        return { Property: this._property, Target: target };
    };
    LinkSpecifierProxy.prototype.getProperty = function () {
        return this._property;
    };
    LinkSpecifierProxy.prototype.getEntitySet = function () {
        return this._entitySet;
    };
    LinkSpecifierProxy.prototype.getQueryOptions = function () {
        return this._queryOptions;
    };
    LinkSpecifierProxy.prototype.getReadLink = function () {
        return this._readLink;
    };
    LinkSpecifierProxy.prototype.setProperty = function (value) {
        this._property = value;
    };
    LinkSpecifierProxy.prototype.setEntitySet = function (value) {
        this._entitySet = value;
    };
    LinkSpecifierProxy.prototype.setQueryOptions = function (value) {
        this._queryOptions = value;
    };
    LinkSpecifierProxy.prototype.setReadLink = function (value) {
        this._readLink = value;
    };
    return LinkSpecifierProxy;
}());
exports.LinkSpecifierProxy = LinkSpecifierProxy;
var ToolbarControlProxy = (function (_super) {
    __extends(ToolbarControlProxy, _super);
    function ToolbarControlProxy(context) {
        var _this = _super.call(this, context) || this;
        _this._container = context.element.getContainer();
        return _this;
    }
    ToolbarControlProxy.prototype.getToolbarControls = function () {
        return this._container.getToolbarItems();
    };
    return ToolbarControlProxy;
}(ControlProxy));
exports.ToolbarControlProxy = ToolbarControlProxy;
var TabControlProxy = (function (_super) {
    __extends(TabControlProxy, _super);
    function TabControlProxy(context) {
        return _super.call(this, context) || this;
    }
    TabControlProxy.prototype.isContainer = function () {
        return true;
    };
    Object.defineProperty(TabControlProxy.prototype, "tabItems", {
        get: function () {
            this._items = this._items || this._control.items.map(function (item) {
                return new TabItemProxy(new Context_1.Context(item.binding, item));
            });
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    TabControlProxy.prototype.setItemCaption = function (tabItemName, newCaption) {
        this._control.setItemCaption(tabItemName, newCaption);
    };
    TabControlProxy.prototype.setSelectedTabItemByName = function (tabItemName) {
        this._control.setSelectedTabItemByName(tabItemName);
    };
    TabControlProxy.prototype.setSelectedTabItemByIndex = function (tabItemIndex) {
        this._control.setSelectedTabItemByIndex(tabItemIndex);
    };
    TabControlProxy.prototype.getItemCaption = function (tabItemName) {
        return this._control.getItemCaption(tabItemName);
    };
    TabControlProxy.prototype.getSelectedTabItemName = function () {
        return this._control.getSelectedTabItemName();
    };
    TabControlProxy.prototype.getSelectedTabItemIndex = function () {
        return this._control.getSelectedTabItemIndex();
    };
    return TabControlProxy;
}(ControlProxy));
exports.TabControlProxy = TabControlProxy;
var TabItemProxy = (function (_super) {
    __extends(TabItemProxy, _super);
    function TabItemProxy(context) {
        var _this = _super.call(this, context) || this;
        _this._container = context.element.parent;
        return _this;
    }
    TabItemProxy.prototype.getCaption = function () {
        return this._control.caption;
    };
    TabItemProxy.prototype.setCaption = function (newCaption) {
        this._container.setItemCaption(this.getName(), newCaption);
    };
    return TabItemProxy;
}(ControlProxy));
exports.TabItemProxy = TabItemProxy;
var SideDrawerControlProxy = (function (_super) {
    __extends(SideDrawerControlProxy, _super);
    function SideDrawerControlProxy(context) {
        return _super.call(this, context) || this;
    }
    SideDrawerControlProxy.prototype.isContainer = function () {
        return true;
    };
    SideDrawerControlProxy.prototype.setSideDrawerButton = function (iconPath) {
        var page = this._control.getCurrentItemPage();
        return page.setSideDrawerButton(iconPath);
    };
    Object.defineProperty(SideDrawerControlProxy.prototype, "menuItems", {
        get: function () {
            this._items = new Array();
            var itemsCountPerSection = this._control.getItemsCountPerSection();
            for (var sectionIndex = 0; sectionIndex < itemsCountPerSection.length; sectionIndex++) {
                var sectionItems = [];
                for (var itemIndex = 0; itemIndex < itemsCountPerSection[sectionIndex]; itemIndex++) {
                    var menuItem = new SideDrawerMenuItemProxy([sectionIndex, itemIndex], this._control, new Context_1.Context(null, this._control));
                    sectionItems.push(menuItem);
                }
                this._items.push(sectionItems);
            }
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerControlProxy.prototype, "sections", {
        get: function () {
            return this._control.getSectionCaptions();
        },
        enumerable: true,
        configurable: true
    });
    SideDrawerControlProxy.prototype.getSelectedMenuItemIndexPath = function () {
        return this._control.getSelectedMenuItemIndexPath();
    };
    SideDrawerControlProxy.prototype.getSelectedMenuItemName = function () {
        return this._control.getSelectedMenuItemName();
    };
    SideDrawerControlProxy.prototype.setSelectedMenuItemByName = function (name) {
        this._control.setSelectedMenuItemByName(name);
    };
    SideDrawerControlProxy.prototype.setSelectedMenuItemByIndexPath = function (indexPath) {
        this._control.setSelectedMenuItemByIndexPath(indexPath);
    };
    SideDrawerControlProxy.prototype.getMenuItemsAtSection = function (sectionIndex) {
        return this.menuItems[sectionIndex];
    };
    SideDrawerControlProxy.prototype.setSectionVisibilityAtIndex = function (sectionIndex, visibility) {
        this._control.setSectionVisibilityAtIndex(sectionIndex, visibility);
    };
    return SideDrawerControlProxy;
}(ControlProxy));
exports.SideDrawerControlProxy = SideDrawerControlProxy;
var SideDrawerMenuItemProxy = (function (_super) {
    __extends(SideDrawerMenuItemProxy, _super);
    function SideDrawerMenuItemProxy(indexPath, container, context) {
        var _this = _super.call(this, context) || this;
        _this._indexPath = indexPath;
        _this._container = container;
        return _this;
    }
    SideDrawerMenuItemProxy.prototype.getTitle = function () {
        return this._container.getMenuItemCaption(this._indexPath);
    };
    SideDrawerMenuItemProxy.prototype.setTitle = function (title) {
        this._container.setMenuItemCaption(this._indexPath, title);
    };
    SideDrawerMenuItemProxy.prototype.setVisibility = function (visibility) {
        this._container.setMenuItemVisibility(this._indexPath, visibility);
    };
    return SideDrawerMenuItemProxy;
}(ClientAPI));
exports.SideDrawerMenuItemProxy = SideDrawerMenuItemProxy;
var ODataProviderProxy = (function () {
    function ODataProviderProxy(serviceName) {
        this._serviceName = serviceName;
    }
    ODataProviderProxy.prototype.isOfflineEnabled = function () {
        return false;
    };
    ODataProviderProxy.prototype.isInitialized = function () {
        return IDataService_1.IDataService.instance().getResolvedServiceInfo(this._serviceName) != null;
    };
    return ODataProviderProxy;
}());
exports.ODataProviderProxy = ODataProviderProxy;
var OfflineDataProviderProxy = (function (_super) {
    __extends(OfflineDataProviderProxy, _super);
    function OfflineDataProviderProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OfflineDataProviderProxy.prototype.isOfflineEnabled = function () {
        return true;
    };
    OfflineDataProviderProxy.prototype.getOfflineParameters = function () {
        return new OfflineDataParametersProxy(this._serviceName);
    };
    return OfflineDataProviderProxy;
}(ODataProviderProxy));
exports.OfflineDataProviderProxy = OfflineDataProviderProxy;
var OfflineDataParametersProxy = (function () {
    function OfflineDataParametersProxy(serviceName) {
        this._serviceName = serviceName;
    }
    OfflineDataParametersProxy.prototype.getCustomHeaders = function () {
        return IDataService_1.IDataService.instance().getOfflineParameter(this._serviceName, 'CustomHeaders');
    };
    OfflineDataParametersProxy.prototype.setCustomHeaders = function (headers) {
        IDataService_1.IDataService.instance().setOfflineParameter(this._serviceName, 'CustomHeaders', HttpHeadersUtil_1.HttpHeadersUtil.convertHeaders(headers));
    };
    return OfflineDataParametersProxy;
}());
exports.OfflineDataParametersProxy = OfflineDataParametersProxy;
var HttpResponseContentProxy = (function () {
    function HttpResponseContentProxy(url, responseAndData) {
        this._url = url;
        this._responseAndData = responseAndData;
    }
    HttpResponseContentProxy.prototype.getData = function () {
        return mdk_sap_1.HttpResponse.getData(this._responseAndData);
    };
    HttpResponseContentProxy.prototype.toFile = function (destinationFilePath) {
        return mdk_sap_1.HttpResponse.toFile(this._responseAndData, this._url, destinationFilePath);
    };
    HttpResponseContentProxy.prototype.toImage = function () {
        return mdk_sap_1.HttpResponse.toImage(this._responseAndData);
    };
    HttpResponseContentProxy.prototype.toString = function () {
        return mdk_sap_1.HttpResponse.toString(this._responseAndData);
    };
    return HttpResponseContentProxy;
}());
exports.HttpResponseContentProxy = HttpResponseContentProxy;
var HttpResponseProxy = (function () {
    function HttpResponseProxy(headers, mimeType, statusCode, content) {
        this.headers = headers;
        this.mimeType = mimeType;
        this.statusCode = statusCode;
        this.content = content;
    }
    return HttpResponseProxy;
}());
exports.HttpResponseProxy = HttpResponseProxy;
