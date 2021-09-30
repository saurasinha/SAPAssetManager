"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../../BaseJSONDefinition");
var ErrorMessage_1 = require("../../../errorHandling/ErrorMessage");
var SideDrawerItemDefinition = (function (_super) {
    __extends(SideDrawerItemDefinition, _super);
    function SideDrawerItemDefinition(path, data) {
        var _this = _super.call(this, path, data) || this;
        _this._resetIfPressedWhenActive = false;
        _this._visible = true;
        _this._styles = {};
        if (data._Name === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_FIELD_NAME_MISSING);
        }
        if (data.Title === undefined || data.Title === '') {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_SIDEDRAWER_MENU_ITEM_FIELD_TITLE_MISSING);
        }
        _this._title = data.Title;
        _this._image = data.Image;
        _this._action = data.OnPress;
        _this._pageToOpen = data.PageToOpen;
        if (data.ResetIfPressedWhenActive !== undefined) {
            _this._resetIfPressedWhenActive = data.ResetIfPressedWhenActive;
        }
        if (data.Visible !== undefined) {
            _this._visible = data.Visible;
        }
        _this._styles = data.Styles;
        _this._textAlignment = data.TextAlignment;
        return _this;
    }
    Object.defineProperty(SideDrawerItemDefinition.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            this._title = title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "pageToOpen", {
        get: function () {
            return this._pageToOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "resetIfPressedWhenActive", {
        get: function () {
            return this._resetIfPressedWhenActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerItemDefinition.prototype, "textAlignment", {
        get: function () {
            return this._textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    return SideDrawerItemDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.SideDrawerItemDefinition = SideDrawerItemDefinition;
