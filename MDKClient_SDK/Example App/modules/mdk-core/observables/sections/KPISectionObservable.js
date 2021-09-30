"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KPIHeaderSectionObservable_1 = require("./KPIHeaderSectionObservable");
var KPISectionObservable = (function (_super) {
    __extends(KPISectionObservable, _super);
    function KPISectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KPISectionObservable.prototype.bind = function () {
        return this.bindKPIData(this.section.definition.data);
    };
    KPISectionObservable.prototype.onItemPress = function (item) {
        var selectedItem = this.section.definition.KPIItems[item];
        return this.executeItemOnPress(selectedItem);
    };
    return KPISectionObservable;
}(KPIHeaderSectionObservable_1.KPIHeaderSectionObservable));
exports.KPISectionObservable = KPISectionObservable;
