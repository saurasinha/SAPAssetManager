"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var KeyValueSectionObservable_1 = require("../observables/sections/KeyValueSectionObservable");
var PressedItem_1 = require("../controls/PressedItem");
var KeyValueSection = (function (_super) {
    __extends(KeyValueSection, _super);
    function KeyValueSection(props) {
        return _super.call(this, props) || this;
    }
    KeyValueSection.prototype.onPress = function (keyValueRow, viewFacade) {
        this.page.context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(viewFacade);
        return this.observable().onPress(keyValueRow);
    };
    KeyValueSection.prototype._createObservable = function () {
        return new KeyValueSectionObservable_1.KeyValueSectionObservable(this);
    };
    return KeyValueSection;
}(BaseSection_1.BaseSection));
exports.KeyValueSection = KeyValueSection;
;
