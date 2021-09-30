"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../../BaseJSONDefinition");
var SideDrawerHeaderDefinition = (function (_super) {
    __extends(SideDrawerHeaderDefinition, _super);
    function SideDrawerHeaderDefinition(path, data) {
        var _this = _super.call(this, path, data) || this;
        _this._iconIsCircular = false;
        _this._disableIconText = false;
        _this._icon = data.Icon;
        _this._headline = data.Headline;
        _this._subHeadline = data.SubHeadline;
        _this._action = data.OnPress;
        if (data.IconIsCircular !== undefined) {
            _this._iconIsCircular = data.IconIsCircular;
        }
        if (data.DisableIconText !== undefined) {
            _this._disableIconText = data.DisableIconText;
        }
        _this._target = data.Target;
        _this._alignment = data.Alignment;
        return _this;
    }
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "headline", {
        get: function () {
            return this._headline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "subHeadline", {
        get: function () {
            return this._subHeadline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "iconIsCircular", {
        get: function () {
            return this._iconIsCircular;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "disableIconText", {
        get: function () {
            return this._disableIconText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerHeaderDefinition.prototype, "alignment", {
        get: function () {
            return this._alignment;
        },
        enumerable: true,
        configurable: true
    });
    return SideDrawerHeaderDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.SideDrawerHeaderDefinition = SideDrawerHeaderDefinition;
