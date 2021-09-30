"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionDefinition_1 = require("./BaseCollectionSectionDefinition");
var ImageCollectionSectionDefinition = (function (_super) {
    __extends(ImageCollectionSectionDefinition, _super);
    function ImageCollectionSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "title", {
        get: function () {
            return this.data.ImageCell.Title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "subtitle", {
        get: function () {
            return this.data.ImageCell.Subtitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "attribute", {
        get: function () {
            return this.data.ImageCell.Attribute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "image", {
        get: function () {
            return this.data.ImageCell.Image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "imageIsCircular", {
        get: function () {
            return this.data.ImageCell.ImageIsCircular;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "imageCell", {
        get: function () {
            return this.data.ImageCell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "imageCells", {
        get: function () {
            return this.data.ImageCells || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "onPress", {
        get: function () {
            return this.data.ImageCell.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionDefinition.prototype, "usesExtensionViews", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ImageCollectionSectionDefinition;
}(BaseCollectionSectionDefinition_1.BaseCollectionSectionDefinition));
exports.ImageCollectionSectionDefinition = ImageCollectionSectionDefinition;
;
