"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var TabItemDefinition = (function (_super) {
    __extends(TabItemDefinition, _super);
    function TabItemDefinition(path, item, parent) {
        var _this = _super.call(this, path, item, parent) || this;
        _this._enabled = true;
        _this._visible = true;
        _this._resetIfPressedWhenActive = false;
        if (item._Name === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_FIELD_NAME_MISSING);
        }
        _this._name = item._Name;
        _this._caption = item.Caption;
        _this._image = item.Image;
        _this._pageToOpen = item.PageToOpen;
        _this._action = (item.OnPressAction || item.OnPress);
        if (item.Enabled !== undefined) {
            _this._enabled = item.Enabled;
        }
        if (item.Visible !== undefined) {
            _this._visible = item.Visible;
        }
        if (item.ResetIfPressedWhenActive !== undefined) {
            _this._resetIfPressedWhenActive = item.ResetIfPressedWhenActive;
        }
        return _this;
    }
    TabItemDefinition.prototype.getType = function () {
        return BaseControlDefinition_1.BaseControlDefinition.type.TabItem;
    };
    Object.defineProperty(TabItemDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "caption", {
        get: function () {
            return this._caption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "pageToOpen", {
        get: function () {
            return this._pageToOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItemDefinition.prototype, "resetIfPressedWhenActive", {
        get: function () {
            return this._resetIfPressedWhenActive;
        },
        enumerable: true,
        configurable: true
    });
    return TabItemDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.TabItemDefinition = TabItemDefinition;
;
