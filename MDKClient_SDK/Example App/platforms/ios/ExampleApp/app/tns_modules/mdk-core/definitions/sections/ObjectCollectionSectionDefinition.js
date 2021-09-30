"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectTableSectionDefinition_1 = require("./ObjectTableSectionDefinition");
var ObjectCollectionSectionDefinition = (function (_super) {
    __extends(ObjectCollectionSectionDefinition, _super);
    function ObjectCollectionSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ObjectCollectionSectionDefinition.prototype, "usesExtensionViews", {
        get: function () {
            return this.data.Extension !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectCollectionSectionDefinition.prototype, "onPress", {
        get: function () {
            return this.usesExtensionViews ? this.data.Extension.OnPress : this.data.ObjectCell.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    return ObjectCollectionSectionDefinition;
}(ObjectTableSectionDefinition_1.ObjectTableSectionDefinition));
exports.ObjectCollectionSectionDefinition = ObjectCollectionSectionDefinition;
;
