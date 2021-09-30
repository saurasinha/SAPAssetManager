"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var ClosePageActionBuilder = (function (_super) {
    __extends(ClosePageActionBuilder, _super);
    function ClosePageActionBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    ClosePageActionBuilder.prototype.build = function () {
        return _super.prototype.build.call(this).then(function (data) {
            return data;
        });
    };
    ClosePageActionBuilder.prototype.setDismissModal = function (modal) {
        this.data.dismissModal = modal;
        return this;
    };
    ClosePageActionBuilder.prototype.setCancelPendingActions = function (cancelPendingActions) {
        this.data.cancelPendingActions = cancelPendingActions;
        return this;
    };
    return ClosePageActionBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ClosePageActionBuilder = ClosePageActionBuilder;
