"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var CollectionLayoutDefinition_1 = require("./CollectionLayoutDefinition");
var BaseCollectionSectionDefinition = (function (_super) {
    __extends(BaseCollectionSectionDefinition, _super);
    function BaseCollectionSectionDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this._collectionLayoutDefinition = new CollectionLayoutDefinition_1.CollectionLayoutDefinition(path, data.Layout, _this);
        return _this;
    }
    Object.defineProperty(BaseCollectionSectionDefinition.prototype, "collectionLayoutDefinition", {
        get: function () {
            return this._collectionLayoutDefinition;
        },
        enumerable: true,
        configurable: true
    });
    return BaseCollectionSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.BaseCollectionSectionDefinition = BaseCollectionSectionDefinition;
;
