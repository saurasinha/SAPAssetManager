"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var CollectionLayoutDefinition = (function (_super) {
    __extends(CollectionLayoutDefinition, _super);
    function CollectionLayoutDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        return _this;
    }
    Object.defineProperty(CollectionLayoutDefinition.prototype, "numberOfColumns", {
        get: function () {
            if (this.data) {
                return this.data.NumberOfColumns;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionLayoutDefinition.prototype, "minimumInteritemSpacing", {
        get: function () {
            if (this.data) {
                return this.data.MinimumInteritemSpacing;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionLayoutDefinition.prototype, "layoutType", {
        get: function () {
            if (this.data) {
                return this.data.LayoutType;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    return CollectionLayoutDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.CollectionLayoutDefinition = CollectionLayoutDefinition;
