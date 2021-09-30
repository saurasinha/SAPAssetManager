"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var SimplePropertyCollectionSectionObservable_1 = require("../observables/sections/SimplePropertyCollectionSectionObservable");
var PressedItem_1 = require("../controls/PressedItem");
var SimplePropertyCollectionSection = (function (_super) {
    __extends(SimplePropertyCollectionSection, _super);
    function SimplePropertyCollectionSection(props) {
        return _super.call(this, props) || this;
    }
    SimplePropertyCollectionSection.prototype.onPress = function (cell, viewFacade) {
        this.page.context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(viewFacade);
        return this.observable().onPress(cell);
    };
    SimplePropertyCollectionSection.prototype._createObservable = function () {
        return new SimplePropertyCollectionSectionObservable_1.SimplePropertyCollectionSectionObservable(this);
    };
    return SimplePropertyCollectionSection;
}(BaseSection_1.BaseSection));
exports.SimplePropertyCollectionSection = SimplePropertyCollectionSection;
;
