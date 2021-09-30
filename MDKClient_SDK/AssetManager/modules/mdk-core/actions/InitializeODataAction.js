"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var ODataAction_1 = require("./ODataAction");
var DataServiceDefinition_1 = require("../definitions/DataServiceDefinition");
var InitializeODataActionDefinition_1 = require("../definitions/actions/InitializeODataActionDefinition");
var SecureStore_1 = require("../storage/SecureStore");
var ClientSettings_1 = require("../storage/ClientSettings");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var ODataServiceBuilder_1 = require("../builders/odata/service/ODataServiceBuilder");
var app = require("tns-core-modules/application");
var InitializeODataAction = (function (_super) {
    __extends(InitializeODataAction, _super);
    function InitializeODataAction(definition) {
        var _this = this;
        if (!(definition instanceof InitializeODataActionDefinition_1.InitializeODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_INITIALIZEODATAACTION_WITHOUT_DEFINITION);
        }
        ClientSettings_1.ClientSettings.setApplicationServicePath(definition.getService());
        _this = _super.call(this, definition) || this;
        return _this;
    }
    InitializeODataAction.prototype.execute = function () {
        var _this = this;
        var inDemoMode = ClientSettings_1.ClientSettings.isDemoMode();
        var dbPath = inDemoMode ? ClientSettings_1.ClientSettings.getDemoDbPath() : null;
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setService(this.getService())
            .setProgressText(definition.getProgressText())
            .setShowActivityIndicator(definition.showActivityIndicator);
        return builder.build().then(function (params) {
            var serviceName = params.service;
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(serviceName);
            var unresolvedServiceHeaders = IDataService_1.IDataService.instance().getServiceHeaders(serviceName);
            var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
            var sbuilder = new ODataServiceBuilder_1.ODataServiceBuilder(_this.context());
            sbuilder.setOfflineCsdlOptions(serviceDefinition.offlineCsdlOptions)
                .setOfflineServiceOptions(serviceDefinition.offlineServiceOptions)
                .setOfflineStoreParameters(serviceDefinition.offlineStoreParameters)
                .setOfflineEnabled(serviceDefinition.offlineEnabled)
                .setCsdlOptions(serviceDefinition.csdlOptions)
                .setServiceOptions(serviceDefinition.serviceOptions)
                .setLanguageUrlParam(serviceDefinition.languageUrlParam);
            return Promise.all([
                sbuilder.build(),
                EvaluateTarget_1.asHeaders(unresolvedServiceHeaders, _this.context())
            ]).then(function (result) {
                var sparams = result[0];
                var serviceHeaders = result[1];
                IDataService_1.IDataService.instance().saveResolvedServiceInfo(serviceName, sparams);
                if (DataServiceDefinition_1.DataServiceDefinition.isOffline(sparams.offlineEnabled)) {
                    var progressText_1 = params.showActivityIndicator ? params.progressText : {};
                    var applicationID_1 = ClientSettings_1.ClientSettings.getAppId();
                    var storeEncryptionKey_1;
                    if (!ClientSettings_1.ClientSettings.isDemoMode()) {
                        storeEncryptionKey_1 = SecureStore_1.SecureStore.getInstance().getString('OFFLINE_STORE_ENCRYPTION_KEY');
                    }
                    var serviceTimeZoneAbbreviation_1 = ClientSettings_1.ClientSettings.getServiceTimeZoneAbbreviation();
                    var debugODataProvider_1 = ClientSettings_1.ClientSettings.getDebugODataProvider();
                    var serviceUrlSuffix = _this.getServiceUrlSuffix(serviceUrl);
                    serviceUrl = serviceUrl + serviceUrlSuffix;
                    var csdlOptions_1 = sparams.offlineCsdlOptions;
                    var serviceOptions_1 = sparams.offlineServiceOptions;
                    var storeParameters_1 = sparams.offlineStoreParameters;
                    var currentUser_1 = ClientSettings_1.ClientSettings.getUserInfo();
                    return EvaluateTarget_1.asDefiningRequests(_this.definition.data, _this.context()).then(function (definingRequests) {
                        return IDataService_1.IDataService.instance().initializeOfflineStore({
                            serviceUrl: serviceUrl,
                            applicationID: applicationID_1,
                            definingRequests: definingRequests,
                            storeEncryptionKey: storeEncryptionKey_1,
                            inDemoMode: inDemoMode,
                            dbPath: dbPath,
                            serviceTimeZoneAbbreviation: serviceTimeZoneAbbreviation_1,
                            debugODataProvider: debugODataProvider_1,
                            progressText: progressText_1,
                            csdlOptions: csdlOptions_1,
                            serviceOptions: serviceOptions_1,
                            storeParameters: storeParameters_1,
                            serviceHeaders: serviceHeaders,
                            currentUser: currentUser_1
                        }).then(function (data) {
                            return app.ios || app.android ?
                                new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
                        });
                    });
                }
                else {
                    if (ClientSettings_1.ClientSettings.isDemoMode()) {
                        throw new Error(ErrorMessage_1.ErrorMessage.NOT_SUPPORTED_IN_DEMOMODE);
                    }
                    _this.addServiceLanguageParam(serviceUrl, sparams.languageUrlParam);
                    var csdlOptions = sparams.csdlOptions;
                    var serviceOptions = sparams.serviceOptions;
                    return IDataService_1.IDataService.instance().createService({ serviceUrl: serviceUrl, csdlOptions: csdlOptions,
                        serviceOptions: serviceOptions, serviceHeaders: serviceHeaders }).then(function () {
                        return IDataService_1.IDataService.instance().openService({ serviceUrl: serviceUrl }).then(function (data) {
                            return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
                        });
                    });
                }
            });
        });
    };
    InitializeODataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return InitializeODataAction;
}(ODataAction_1.ODataAction));
exports.InitializeODataAction = InitializeODataAction;
;
