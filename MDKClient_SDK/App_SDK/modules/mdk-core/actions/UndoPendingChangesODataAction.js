"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UndoPendingChangesODataActionDefinition_1 = require("../definitions/actions/UndoPendingChangesODataActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var app = require("tns-core-modules/application");
var UndoPendingChangesODataAction = (function (_super) {
    __extends(UndoPendingChangesODataAction, _super);
    function UndoPendingChangesODataAction(definition) {
        var _this = _super.call(this, definition) || this;
        if (!(definition instanceof UndoPendingChangesODataActionDefinition_1.UndoPendingChangesODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_UNDOPENDINGCHANGESACTION_WITHOUT_DEFINITION);
        }
        return _this;
    }
    UndoPendingChangesODataAction.prototype.execute = function () {
        var _this = this;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            _this.service = service;
            _this._resolvedEntitySet = _this.service.entitySet;
            return IDataService_1.IDataService.instance().undoPendingChanges(_this.service).then(function (data) {
                _this.data = data;
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    UndoPendingChangesODataAction.prototype.publishAfterSuccess = function () {
        var actionResult = {};
        if (this.data && this.data.length > 0) {
            actionResult = JSON.parse(this.data);
        }
        var contextBinding = this.context().binding;
        var actionBinding = this.context().clientAPIProps.actionBinding;
        var contextBindingEntitySet = (contextBinding && contextBinding['@odata.readLink']) ?
            contextBinding['@odata.readLink'].split('(')[0] : '';
        var actionBindingEntitySet = (actionBinding && actionBinding['@odata.readLink']) ?
            actionBinding['@odata.readLink'].split('(')[0] : '';
        if (contextBindingEntitySet === this.service.entitySet && typeof contextBinding !== 'undefined' &&
            contextBinding !== null) {
            Object.keys(actionResult).forEach(function (sKey) {
                if (contextBinding[sKey]) {
                    contextBinding[sKey] = actionResult[sKey];
                }
            });
        }
        if (actionBindingEntitySet === this.service.entitySet && typeof actionBinding !== 'undefined' &&
            actionBinding !== null) {
            Object.keys(actionResult).forEach(function (sKey) {
                if (actionBinding[sKey]) {
                    actionBinding[sKey] = actionResult[sKey];
                }
            });
        }
        return Promise.resolve(true);
    };
    return UndoPendingChangesODataAction;
}(ODataAction_1.ODataAction));
exports.UndoPendingChangesODataAction = UndoPendingChangesODataAction;
;
