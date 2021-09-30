"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var DataEventHandler_1 = require("../data/DataEventHandler");
var DataAction = (function (_super) {
    __extends(DataAction, _super);
    function DataAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this._oDataEventHandler = DataEventHandler_1.DataEventHandler.getInstance();
        return _this;
    }
    DataAction.prototype.getService = function () {
        var definition = this.definition;
        return definition.getService();
    };
    DataAction.prototype.onSuccess = function (actionResult) {
        var _this = this;
        return this.publishAfterSuccess().then(function (result) {
            if (result) {
                _this._oDataEventHandler.publish(_this, actionResult.data);
            }
            return _super.prototype.onSuccess.call(_this, actionResult);
        });
    };
    DataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(false);
    };
    return DataAction;
}(BaseAction_1.BaseAction));
exports.DataAction = DataAction;
;
