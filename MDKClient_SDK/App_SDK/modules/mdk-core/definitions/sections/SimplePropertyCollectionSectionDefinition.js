"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionDefinition_1 = require("./BaseCollectionSectionDefinition");
var SimplePropertyCollectionSectionDefinition = (function (_super) {
    __extends(SimplePropertyCollectionSectionDefinition, _super);
    function SimplePropertyCollectionSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "accessoryType", {
        get: function () {
            return this.data.SimplePropertyCell.AccessoryType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "keyName", {
        get: function () {
            return this.data.SimplePropertyCell.KeyName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "value", {
        get: function () {
            return this.data.SimplePropertyCell.Value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "simplePropertyCell", {
        get: function () {
            return this.data.SimplePropertyCell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "simplePropertyCells", {
        get: function () {
            return this.data.SimplePropertyCells || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "onPress", {
        get: function () {
            return (this.data.SimplePropertyCell === undefined
                || this.data.SimplePropertyCell.OnPress === undefined ? undefined : this.data.SimplePropertyCell.OnPress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "usesExtensionViews", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionDefinition.prototype, "usePreviewMode", {
        get: function () {
            return this.data.MaxItemCount !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    return SimplePropertyCollectionSectionDefinition;
}(BaseCollectionSectionDefinition_1.BaseCollectionSectionDefinition));
exports.SimplePropertyCollectionSectionDefinition = SimplePropertyCollectionSectionDefinition;
;
