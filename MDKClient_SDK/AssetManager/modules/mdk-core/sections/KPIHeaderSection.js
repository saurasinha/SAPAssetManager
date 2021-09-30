"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KPIHeaderSectionObservable_1 = require("../observables/sections/KPIHeaderSectionObservable");
var HeaderSection_1 = require("./HeaderSection");
var KPIHeaderSection = (function (_super) {
    __extends(KPIHeaderSection, _super);
    function KPIHeaderSection(props) {
        return _super.call(this, props) || this;
    }
    KPIHeaderSection.prototype.onItemPress = function (item) {
        return this.observable().onItemPress(item);
    };
    KPIHeaderSection.prototype.onPress = function (cell, viewFacade) {
    };
    KPIHeaderSection.prototype._createObservable = function () {
        return new KPIHeaderSectionObservable_1.KPIHeaderSectionObservable(this);
    };
    return KPIHeaderSection;
}(HeaderSection_1.HeaderSection));
exports.KPIHeaderSection = KPIHeaderSection;
