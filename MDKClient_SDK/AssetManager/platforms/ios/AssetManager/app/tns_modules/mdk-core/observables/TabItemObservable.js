"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObservable_1 = require("./BaseObservable");
var TabItemObservable = (function (_super) {
    __extends(TabItemObservable, _super);
    function TabItemObservable(oControl, oControlDef, oPage) {
        return _super.call(this, oControl, oControlDef, oPage) || this;
    }
    TabItemObservable.prototype.getBindingTarget = function () {
        return 'enabled';
    };
    return TabItemObservable;
}(BaseObservable_1.BaseObservable));
exports.TabItemObservable = TabItemObservable;
