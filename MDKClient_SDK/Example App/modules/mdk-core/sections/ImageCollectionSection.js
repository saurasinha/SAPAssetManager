"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var ImageCollectionSectionObservable_1 = require("../observables/sections/ImageCollectionSectionObservable");
var ImageCollectionSection = (function (_super) {
    __extends(ImageCollectionSection, _super);
    function ImageCollectionSection(props) {
        return _super.call(this, props) || this;
    }
    ImageCollectionSection.prototype.onPress = function (cell) {
        return this.observable().onPress(cell);
    };
    ImageCollectionSection.prototype._createObservable = function () {
        return new ImageCollectionSectionObservable_1.ImageCollectionSectionObservable(this);
    };
    return ImageCollectionSection;
}(BaseSection_1.BaseSection));
exports.ImageCollectionSection = ImageCollectionSection;
;
