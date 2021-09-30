"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var ODataAction_1 = require("./ODataAction");
var CallFunctionODataActionDefinition_1 = require("../definitions/actions/CallFunctionODataActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var CallFunctionODataAction = (function (_super) {
    __extends(CallFunctionODataAction, _super);
    function CallFunctionODataAction(definition) {
        var _this = this;
        if (!(definition instanceof CallFunctionODataActionDefinition_1.CallFunctionODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CALLFUNCTIONODATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CallFunctionODataAction.prototype.execute = function () {
        var _this = this;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            return IDataService_1.IDataService.instance().callFunction(service, service.headers).then(function (data) {
                if (service.statefulService && !service.offlineEnabled) {
                    _this._saveSessionObjectIfExisted(data);
                }
                _this._storeToActionBinding(data, service.function.Name);
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    CallFunctionODataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    CallFunctionODataAction.prototype._storeToActionBinding = function (data, functionName) {
        var bindingObj = {};
        if (data) {
            if (data instanceof observable_array_1.ObservableArray) {
                bindingObj[functionName] = data;
            }
            else if (Object.keys(data).length !== 0) {
                bindingObj = data;
            }
        }
        this.context().clientAPIProps.actionBinding = bindingObj;
    };
    CallFunctionODataAction.prototype._saveSessionObjectIfExisted = function (data) {
        var results = [];
        if (data instanceof observable_array_1.ObservableArray) {
            for (var i = 0; i < data.length; i++) {
                results = this._recursiveKeySearch(data.getItem(i));
                if (results.length > 0) {
                    break;
                }
            }
        }
        else {
            results = this._recursiveKeySearch(data);
        }
        if (results.length > 0) {
            var sessionObj = results[0];
            var session = {};
            for (var prop in sessionObj) {
                if (sessionObj.hasOwnProperty(prop) && !prop.startsWith('@odata.')) {
                    session[prop] = sessionObj[prop];
                }
            }
            ClientSettings_1.ClientSettings.setSession(session);
        }
    };
    CallFunctionODataAction.prototype._recursiveKeySearch = function (data) {
        var SESSION = 'session';
        if (data === null) {
            return [];
        }
        if (data !== Object(data)) {
            return [];
        }
        if (data['@odata.type'] && data['@odata.type'].toLowerCase().split('.').pop() === SESSION) {
            return [data];
        }
        else {
            var results = [];
            if (data.constructor === Array) {
                for (var i = 0, len = data.length; i < len; i++) {
                    results = results.concat(this._recursiveKeySearch(data[i]));
                }
                return results;
            }
            for (var dataKey in data) {
                if (data.hasOwnProperty(dataKey)) {
                    if (SESSION === dataKey.toLowerCase() && typeof data[dataKey] === 'object' && data[dataKey] !== null) {
                        results.push(data[dataKey]);
                        break;
                    }
                    results = results.concat(this._recursiveKeySearch(data[dataKey]));
                }
            }
            return results;
        }
    };
    return CallFunctionODataAction;
}(ODataAction_1.ODataAction));
exports.CallFunctionODataAction = CallFunctionODataAction;
;
