"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UniqueIdType_1 = require("../../../common/UniqueIdType");
var IDataService_1 = require("../../../data/IDataService");
var ErrorMessage_1 = require("../../../errorHandling/ErrorMessage");
var IDefinitionProvider_1 = require("../../../definitions/IDefinitionProvider");
var TargetServiceBuilder = (function () {
    function TargetServiceBuilder() {
        this._offlineEnabled = true;
        this._properties = [];
        this._statefulService = false;
        this._serverSidePaging = false;
    }
    TargetServiceBuilder.fromDefinition = function (data) {
        return new TargetServiceBuilder().entitySet(data.Target.EntitySet)
            .function(data.Target.Function)
            .keyProperties(data.Target.KeyProperties)
            .properties(data.Properties)
            .queryOptions(data.Target.QueryOptions)
            .readLink(data.Target.ReadLink)
            .editLink(data.Target.EditLink)
            .serviceName(data.Target.Service)
            .uniqueTypeId(UniqueIdType_1.stringToUniqueIdType(data.Target.UniqueIdType))
            .requestOptions(data.RequestOptions)
            .headers(data.Headers)
            .serverSidePaging(data.Target.ServerSidePaging)
            .requestProperties(data.Target.RequestProperties)
            .path(data.Target.Path)
            .outputPath(data.Target.OutputPath)
            .build();
    };
    TargetServiceBuilder.prototype.build = function () {
        this._valid();
        var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(this._serviceName);
        this._statefulService = serviceDefinition.statefulService;
        var targetSpecifier = {
            editLink: this._editLink,
            entitySet: this._entitySet,
            function: this._function,
            headers: this._headers,
            keyProperties: this._keyProperties,
            offlineEnabled: IDataService_1.IDataService.instance().offlineEnabled(this._serviceName),
            path: this._path,
            outputPath: this._outputPath,
            properties: this._properties,
            queryOptions: this._queryOptions,
            readLink: this._readLink,
            requestOptions: this._requestOptions,
            requestProperties: this._requestProperties,
            serverSidePaging: this._serverSidePaging,
            serviceUrl: IDataService_1.IDataService.instance().urlForServiceName(this._serviceName),
            statefulService: this._statefulService,
            uniqueIdType: this._uniqueTypeId,
            serviceHeaders: IDataService_1.IDataService.instance().getServiceHeaders(this._serviceName),
        };
        if (!targetSpecifier.function) {
            delete targetSpecifier.function;
        }
        if (!targetSpecifier.keyProperties) {
            delete targetSpecifier.keyProperties;
        }
        if (!targetSpecifier.queryOptions) {
            delete targetSpecifier.queryOptions;
        }
        if (!targetSpecifier.readLink) {
            delete targetSpecifier.readLink;
        }
        if (!targetSpecifier.editLink) {
            delete targetSpecifier.editLink;
        }
        if (!targetSpecifier.uniqueIdType) {
            targetSpecifier.uniqueIdType = UniqueIdType_1.UniqueIdType.String;
        }
        if (!targetSpecifier.requestOptions) {
            delete targetSpecifier.requestOptions;
        }
        if (!targetSpecifier.headers) {
            delete targetSpecifier.headers;
        }
        if (!targetSpecifier.serverSidePaging) {
            delete targetSpecifier.serverSidePaging;
        }
        if (!targetSpecifier.requestProperties) {
            delete targetSpecifier.requestProperties;
        }
        if (!targetSpecifier.path) {
            delete targetSpecifier.path;
        }
        if (!targetSpecifier.outputPath) {
            delete targetSpecifier.outputPath;
        }
        if (!targetSpecifier.serviceHeaders) {
            delete targetSpecifier.serviceHeaders;
        }
        return targetSpecifier;
    };
    TargetServiceBuilder.prototype.entitySet = function (entitySet) {
        this._entitySet = entitySet;
        return this;
    };
    TargetServiceBuilder.prototype.function = function (oFunction) {
        this._function = oFunction;
        return this;
    };
    TargetServiceBuilder.prototype.keyProperties = function (keyProperties) {
        this._keyProperties = keyProperties;
        return this;
    };
    TargetServiceBuilder.prototype.properties = function (properties) {
        this._properties = properties;
        return this;
    };
    TargetServiceBuilder.prototype.queryOptions = function (queryOptions) {
        this._queryOptions = queryOptions;
        return this;
    };
    TargetServiceBuilder.prototype.readLink = function (readLink) {
        this._readLink = readLink;
        return this;
    };
    TargetServiceBuilder.prototype.editLink = function (editLink) {
        this._editLink = editLink;
        return this;
    };
    TargetServiceBuilder.prototype.serviceName = function (serviceName) {
        this._serviceName = serviceName;
        return this;
    };
    TargetServiceBuilder.prototype.uniqueTypeId = function (uniqueTypeId) {
        this._uniqueTypeId = uniqueTypeId;
        return this;
    };
    TargetServiceBuilder.prototype.requestOptions = function (requestOptions) {
        this._requestOptions = requestOptions;
        return this;
    };
    TargetServiceBuilder.prototype.headers = function (headers) {
        this._headers = headers;
        return this;
    };
    TargetServiceBuilder.prototype.serverSidePaging = function (serverSidePaging) {
        if (serverSidePaging !== undefined) {
            this._serverSidePaging = serverSidePaging;
        }
        return this;
    };
    TargetServiceBuilder.prototype.requestProperties = function (requestProperties) {
        this._requestProperties = requestProperties;
        return this;
    };
    TargetServiceBuilder.prototype.path = function (path) {
        this._path = path;
        return this;
    };
    TargetServiceBuilder.prototype.outputPath = function (outputPath) {
        this._outputPath = outputPath;
        return this;
    };
    TargetServiceBuilder.prototype._valid = function () {
        if (!this._serviceName) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.SERVICE_NAME_NOT_DEFINED, 'serviceName'));
        }
        else if (typeof this._serviceName !== 'string') {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.SERVICE_NAME_WITH_WRONG_PARAM_TYPE, 'serviceName'));
        }
    };
    return TargetServiceBuilder;
}());
exports.TargetServiceBuilder = TargetServiceBuilder;
