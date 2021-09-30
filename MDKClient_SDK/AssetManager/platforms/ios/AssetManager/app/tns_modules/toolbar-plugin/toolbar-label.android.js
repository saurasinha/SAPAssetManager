"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var label_1 = require("tns-core-modules/ui/label");
var text_base_1 = require("tns-core-modules/ui/text-base");
var view_1 = require("tns-core-modules/ui/core/view");
__export(require("tns-core-modules/ui/label"));
var ToolbarLabel = (function (_super) {
    __extends(ToolbarLabel, _super);
    function ToolbarLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolbarLabel.prototype[text_base_1.fontSizeProperty.setNative] = function (value) {
        var fontSizeUnitToBeUsed = android.util.TypedValue.COMPLEX_UNIT_PX;
        if (this.fontSizeUnit) {
            if (this.fontSizeUnit.toLowerCase() === 'sp') {
                fontSizeUnitToBeUsed = android.util.TypedValue.COMPLEX_UNIT_SP;
            }
        }
        if (typeof value === 'number') {
            this.nativeViewProtected.setTextSize(fontSizeUnitToBeUsed, value);
        }
        else {
            this.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    ToolbarLabel = __decorate([
        text_base_1.CSSType('ToolbarLabel')
    ], ToolbarLabel);
    return ToolbarLabel;
}(label_1.Label));
exports.ToolbarLabel = ToolbarLabel;
var fontSizeUnitProperty = new view_1.Property({
    defaultValue: '', name: 'fontSizeUnit', valueChanged: function (target, oldValue, newValue) {
        target.fontSizeUnit = newValue;
    },
});
fontSizeUnitProperty.register(ToolbarLabel);
