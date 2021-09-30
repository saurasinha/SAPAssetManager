"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var ODataAction_1 = require("./ODataAction");
var InitOfflineODataActionDefinition_1 = require("../definitions/actions/InitOfflineODataActionDefinition");
var SecureStore_1 = require("../storage/SecureStore");
var ClientSettings_1 = require("../storage/ClientSettings");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var ODataServiceBuilder_1 = require("../builders/odata/service/ODataServiceBuilder");
var app = require("tns-core-modules/application");
var InitOfflineODataAction = (function (_super) {
    __extends(InitOfflineODataAction, _super);
    function InitOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof InitOfflineODataActionDefinition_1.InitOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_INITOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        ClientSettings_1.ClientSettings.setApplicationServicePath(definition.getService());
        _this = _super.call(this, definition) || this;
        return _this;
    }
    InitOfflineODataAction.prototype.execute = function () {
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
            var progressText = params.showActivityIndicator ? params.progressText : {};
            var applicationID = ClientSettings_1.ClientSettings.getAppId();
            var storeEncryptionKey;
            if (!ClientSettings_1.ClientSettings.isDemoMode()) {
                storeEncryptionKey = SecureStore_1.SecureStore.getInstance().getString('OFFLINE_STORE_ENCRYPTION_KEY');
            }
            var serviceTimeZoneAbbreviation = ClientSettings_1.ClientSettings.getServiceTimeZoneAbbreviation();
            var debugODataProvider = ClientSettings_1.ClientSettings.getDebugODataProvider();
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(serviceName);
            var serviceUrlSuffix = _this.getServiceUrlSuffix(serviceUrl);
            var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
            serviceUrl = serviceUrl + serviceUrlSuffix;
            var unresolvedServiceHeaders = IDataService_1.IDataService.instance().getServiceHeaders(serviceName);
            var sbuilder = new ODataServiceBuilder_1.ODataServiceBuilder(_this.context());
            sbuilder.setOfflineCsdlOptions(serviceDefinition.offlineCsdlOptions)
                .setOfflineServiceOptions(serviceDefinition.offlineServiceOptions)
                .setOfflineStoreParameters(serviceDefinition.offlineStoreParameters);
            return Promise.all([
                sbuilder.build(),
                EvaluateTarget_1.asHeaders(unresolvedServiceHeaders, _this.context())
            ]).then(function (result) {
                var sparams = result[0];
                var serviceHeaders = result[1];
                sparams.offlineEnabled = true;
                IDataService_1.IDataService.instance().saveResolvedServiceInfo(serviceName, sparams);
                var csdlOptions = sparams.offlineCsdlOptions;
                var serviceOptions = sparams.offlineServiceOptions;
                var storeParameters = sparams.offlineStoreParameters;
                var currentUser = ClientSettings_1.ClientSettings.getUserInfo();
                return EvaluateTarget_1.asDefiningRequests(_this.definition.data, _this.context()).then(function (definingRequests) {
                    return IDataService_1.IDataService.instance().initializeOfflineStore({
                        serviceUrl: serviceUrl,
                        applicationID: applicationID,
                        definingRequests: definingRequests,
                        storeEncryptionKey: storeEncryptionKey,
                        inDemoMode: inDemoMode,
                        dbPath: dbPath,
                        serviceTimeZoneAbbreviation: serviceTimeZoneAbbreviation,
                        debugODataProvider: debugODataProvider,
                        progressText: progressText,
                        csdlOptions: csdlOptions,
                        serviceOptions: serviceOptions,
                        storeParameters: storeParameters,
                        serviceHeaders: serviceHeaders,
                        currentUser: currentUser
                    }).then(function (data) {
                        return app.ios || app.android ?
                            new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
                    });
                });
            });
        });
    };
    InitOfflineODataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return InitOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.InitOfflineODataAction = InitOfflineODataAction;
;
