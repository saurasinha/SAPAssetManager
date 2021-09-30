"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionDefinition_1 = require("./BaseCollectionSectionDefinition");
var KeyValueSectionDefinition = (function (_super) {
    __extends(KeyValueSectionDefinition, _super);
    function KeyValueSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(KeyValueSectionDefinition.prototype, "KeyAndValues", {
        get: function () {
            return this.data.KeyAndValues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyValueSectionDefinition.prototype, "maxItemCount", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    return KeyValueSectionDefinition;
}(BaseCollectionSectionDefinition_1.BaseCollectionSectionDefinition));
exports.KeyValueSectionDefinition = KeyValueSectionDefinition;
