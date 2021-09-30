"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IView_1 = require("../IView");
var IControl = (function (_super) {
    __extends(IControl, _super);
    function IControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(IControl.prototype, "builder", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    IControl.prototype.formatRule = function () {
        return this.definition().data.FormatRule;
    };
    IControl.prototype.container = function () {
        return this._props.container;
    };
    IControl.prototype.page = function () {
        return this._props.page;
    };
    IControl.prototype.getValue = function () {
        return this.observable().getValue();
    };
    IControl.prototype.setStyle = function (cssClassName) {
    };
    IControl.prototype.viewIsNative = function () {
        return false;
    };
    IControl.prototype.setValidationProperty = function (key, value) {
    };
    IControl.prototype.redraw = function () {
    };
    IControl.prototype.onDataChanged = function (action, result) {
    };
    Object.defineProperty(IControl.prototype, "controlProxy", {
        get: function () {
            return this.context.clientAPI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IControl.prototype, "isControl", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IControl.prototype, "isFormCell", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IControl.prototype, "type", {
        get: function () {
            return this.definition().type;
        },
        enumerable: true,
        configurable: true
    });
    return IControl;
}(IView_1.IView));
exports.IControl = IControl;
;
function isControl(element) {
    return element && element.isControl;
}
exports.isControl = isControl;
