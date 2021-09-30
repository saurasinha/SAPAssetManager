"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseNoPagingSectionObservable_1 = require("./BaseNoPagingSectionObservable");
var ImageCollectionSectionDefinition_1 = require("../../definitions/sections/ImageCollectionSectionDefinition");
var Logger_1 = require("../../utils/Logger");
var ImageCollectionSectionObservable = (function (_super) {
    __extends(ImageCollectionSectionObservable, _super);
    function ImageCollectionSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._titleParamKey = 'title';
        _this._subtitleParamKey = 'subtitle';
        _this._attributeParamKey = 'attribute';
        _this._imageParamKey = 'image';
        _this._imageIsCircularParamKey = 'imageIsCircular';
        return _this;
    }
    ImageCollectionSectionObservable.prototype.onPress = function (cell) {
        var adjustedCell = this.adjustForHiddenRows(cell);
        var selectedItem = this.getItem(adjustedCell);
        this.section.page.context.clientAPIProps.actionBinding = selectedItem;
        var onPress = undefined;
        if (this._staticCells) {
            if (selectedItem.onPress) {
                onPress = selectedItem.onPress;
            }
        }
        else {
            onPress = this.section.definition.onPress;
        }
        if (onPress) {
            var handler = this.buildBaseSectionEventHandler();
            return handler.executeActionOrRule(onPress, this.section.context);
        }
        return Promise.resolve();
    };
    Object.defineProperty(ImageCollectionSectionObservable.prototype, "genericCellAggregationPropertyName", {
        get: function () {
            return 'imageCells';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionObservable.prototype, "genericCellPropertyName", {
        get: function () {
            return 'imageCell';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCollectionSectionObservable.prototype, "genericSectionDefinitionClass", {
        get: function () {
            return ImageCollectionSectionDefinition_1.ImageCollectionSectionDefinition;
        },
        enumerable: true,
        configurable: true
    });
    ImageCollectionSectionObservable.prototype._keyToItemKey = function (key) {
        switch (key) {
            case 'Title':
                return this._titleParamKey;
            case 'Subtitle':
                return this._subtitleParamKey;
            case 'Attribute':
                return this._attributeParamKey;
            case 'Image':
                return this._imageParamKey;
            case 'ImageIsCircular':
                return this._imageIsCircularParamKey;
            case 'OnPress':
                return undefined;
            case 'Visible':
                return this._visibleKey;
            default:
                Logger_1.Logger.instance.ui.log("_keyToItemKey unrecognized key " + key);
                return undefined;
        }
    };
    ImageCollectionSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    return ImageCollectionSectionObservable;
}(BaseNoPagingSectionObservable_1.BaseNoPagingSectionObservable));
exports.ImageCollectionSectionObservable = ImageCollectionSectionObservable;
