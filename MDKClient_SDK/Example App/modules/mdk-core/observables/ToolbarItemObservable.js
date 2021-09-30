"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObservable_1 = require("./BaseObservable");
var ToolbarItemObservable = (function (_super) {
    __extends(ToolbarItemObservable, _super);
    function ToolbarItemObservable(oControl, oControlDef, oPage) {
        return _super.call(this, oControl, oControlDef, oPage) || this;
    }
    ToolbarItemObservable.prototype.getBindingTarget = function () {
        return 'enabled';
    };
    return ToolbarItemObservable;
}(BaseObservable_1.BaseObservable));
exports.ToolbarItemObservable = ToolbarItemObservable;
