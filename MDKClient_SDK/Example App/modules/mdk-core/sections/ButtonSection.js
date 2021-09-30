"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var ButtonSectionObservable_1 = require("../observables/sections/ButtonSectionObservable");
var PressedItem_1 = require("../controls/PressedItem");
var ButtonSection = (function (_super) {
    __extends(ButtonSection, _super);
    function ButtonSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonSection.prototype.onPress = function (cell, viewFacade) {
        this.page.context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(viewFacade);
        return this.observable().onPress(cell);
    };
    ButtonSection.prototype._createObservable = function () {
        return new ButtonSectionObservable_1.ButtonSectionObservable(this);
    };
    return ButtonSection;
}(BaseSection_1.BaseSection));
exports.ButtonSection = ButtonSection;
