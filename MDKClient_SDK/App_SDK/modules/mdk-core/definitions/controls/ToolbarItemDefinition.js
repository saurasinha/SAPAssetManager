"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ToolbarItemDefinition = (function (_super) {
    __extends(ToolbarItemDefinition, _super);
    function ToolbarItemDefinition(path, item, parent) {
        var _this = _super.call(this, path, item, parent) || this;
        _this._enabled = true;
        _this._visible = true;
        _this._tag = 0;
        _this._width = 0.0;
        _this._clickable = true;
        if (item._Name === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_FIELD_NAME_MISSING);
        }
        _this._name = item._Name;
        _this._systemItem = item.SystemItem;
        _this._caption = item.Caption;
        _this._image = (item.Image || item.Icon);
        _this._action = (item.OnPressAction || item.OnPress);
        if (item.Enabled !== undefined) {
            _this._enabled = item.Enabled;
        }
        if (item.Visible !== undefined) {
            _this._visible = item.Visible;
        }
        if (item.Width) {
            _this._width = item.Width;
        }
        if (item.Clickable !== undefined) {
            _this._clickable = item.Clickable;
        }
        _this._itemType = item.ItemType;
        return _this;
    }
    ToolbarItemDefinition.prototype.getType = function () {
        return BaseControlDefinition_1.BaseControlDefinition.type.ToolbarItem;
    };
    Object.defineProperty(ToolbarItemDefinition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "systemItem", {
        get: function () {
            return this._systemItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "caption", {
        get: function () {
            return this._caption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "clickable", {
        get: function () {
            return this._clickable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItemDefinition.prototype, "itemType", {
        get: function () {
            return this._itemType;
        },
        enumerable: true,
        configurable: true
    });
    return ToolbarItemDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.ToolbarItemDefinition = ToolbarItemDefinition;
;
