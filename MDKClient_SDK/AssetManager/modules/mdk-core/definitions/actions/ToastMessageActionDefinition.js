"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var ToastMessageActionDefinition = (function (_super) {
    __extends(ToastMessageActionDefinition, _super);
    function ToastMessageActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ToastMessageActionDefinition.prototype, "animated", {
        get: function () {
            return this.data.Animated || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastMessageActionDefinition.prototype, "duration", {
        get: function () {
            return this.data.Duration || 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastMessageActionDefinition.prototype, "icon", {
        get: function () {
            return this.data.Icon || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastMessageActionDefinition.prototype, "isIconHidden", {
        get: function () {
            return this.data.IsIconHidden || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastMessageActionDefinition.prototype, "maxNumberOfLines", {
        get: function () {
            if (this.data.MaxNumberOfLines !== undefined) {
                return this.data.MaxNumberOfLines;
            }
            if (this.data.NumberOfLines !== undefined) {
                return this.data.NumberOfLines;
            }
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastMessageActionDefinition.prototype, "message", {
        get: function () {
            return this.data.Message;
        },
        enumerable: true,
        configurable: true
    });
    return ToastMessageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.ToastMessageActionDefinition = ToastMessageActionDefinition;
;
