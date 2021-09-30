"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KPISectionObservable_1 = require("../observables/sections/KPISectionObservable");
var BaseSection_1 = require("./BaseSection");
var KPISection = (function (_super) {
    __extends(KPISection, _super);
    function KPISection(props) {
        return _super.call(this, props) || this;
    }
    KPISection.prototype.onItemPress = function (item) {
        return this.observable().onItemPress(item);
    };
    KPISection.prototype.onPress = function (cell, viewFacade) {
    };
    KPISection.prototype._createObservable = function () {
        return new KPISectionObservable_1.KPISectionObservable(this);
    };
    return KPISection;
}(BaseSection_1.BaseSection));
exports.KPISection = KPISection;
