"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("./BaseJSONDefinition");
var app = require("tns-core-modules/application");
var DataServiceDefinition = (function (_super) {
    __extends(DataServiceDefinition, _super);
    function DataServiceDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(DataServiceDefinition.prototype, "csdlOptions", {
        get: function () {
            var csdlOptions = [];
            if (this.data.OnlineOptions && this.data.OnlineOptions.CSDLOptions) {
                csdlOptions = this.data.OnlineOptions.CSDLOptions;
            }
            return csdlOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "offlineCsdlOptions", {
        get: function () {
            var csdlOptions = [];
            if (this.data.OfflineOptions && this.data.OfflineOptions.CSDLOptions) {
                csdlOptions = this.data.OfflineOptions.CSDLOptions;
            }
            return csdlOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "destinationName", {
        get: function () {
            return this.data.DestinationName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "pathSuffix", {
        get: function () {
            return this.data.PathSuffix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "languageUrlParam", {
        get: function () {
            return this.data.LanguageURLParam;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "serviceURL", {
        get: function () {
            return this.data.ServiceUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "isOffline", {
        get: function () {
            return DataServiceDefinition.isOffline(this.data.OfflineEnabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "isOnline", {
        get: function () {
            return !this.isOffline;
        },
        enumerable: true,
        configurable: true
    });
    DataServiceDefinition.isOffline = function (offlineEnabled) {
        if (app.ios || app.android) {
            return offlineEnabled !== undefined ? offlineEnabled : true;
        }
        else {
            return false;
        }
    };
    DataServiceDefinition.isOnline = function (offlineEnabled) {
        return !DataServiceDefinition.isOffline(offlineEnabled);
    };
    Object.defineProperty(DataServiceDefinition.prototype, "offlineEnabled", {
        get: function () {
            return this.data.OfflineEnabled;
        },
        enumerable: true,
        configurable: true
    });
    DataServiceDefinition.prototype.getApplicationID = function () {
        return this.data.AppId;
    };
    Object.defineProperty(DataServiceDefinition.prototype, "serviceOptions", {
        get: function () {
            var serviceOptions = {};
            if (this.data.OnlineOptions && this.data.OnlineOptions.ServiceOptions) {
                serviceOptions = this.data.OnlineOptions.ServiceOptions;
            }
            return serviceOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "statefulService", {
        get: function () {
            var serviceOptions = this.serviceOptions;
            if (serviceOptions.statefulService === true) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "offlineServiceOptions", {
        get: function () {
            var serviceOptions = {};
            if (this.data.OfflineOptions && this.data.OfflineOptions.ServiceOptions) {
                serviceOptions = this.data.OfflineOptions.ServiceOptions;
            }
            return serviceOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "offlineStoreParameters", {
        get: function () {
            var storeParameters = {};
            if (this.data.OfflineOptions && this.data.OfflineOptions.StoreParameters) {
                storeParameters = this.data.OfflineOptions.StoreParameters;
            }
            return storeParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataServiceDefinition.prototype, "headers", {
        get: function () {
            return this.data.Headers;
        },
        enumerable: true,
        configurable: true
    });
    return DataServiceDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.DataServiceDefinition = DataServiceDefinition;
;
