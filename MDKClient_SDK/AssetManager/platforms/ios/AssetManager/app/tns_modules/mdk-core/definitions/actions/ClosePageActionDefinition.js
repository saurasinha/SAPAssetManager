"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var ClosePageActionDefinition = (function (_super) {
    __extends(ClosePageActionDefinition, _super);
    function ClosePageActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(ClosePageActionDefinition.prototype, "cancelPendingActions", {
        get: function () {
            return this.data.CancelPendingActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClosePageActionDefinition.prototype, "dismissModal", {
        get: function () {
            return this.data.DismissModal;
        },
        enumerable: true,
        configurable: true
    });
    ClosePageActionDefinition.dismissModalType = {
        Canceled: 'Action.Type.ClosePage.Canceled',
        Completed: 'Action.Type.ClosePage.Completed',
    };
    return ClosePageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.ClosePageActionDefinition = ClosePageActionDefinition;
;
