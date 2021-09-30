"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../../BaseJSONDefinition");
var SideDrawerItemDefinition_1 = require("./SideDrawerItemDefinition");
var Logger_1 = require("../../../utils/Logger");
var ErrorMessage_1 = require("../../../errorHandling/ErrorMessage");
var SideDrawerSectionDefinition = (function (_super) {
    __extends(SideDrawerSectionDefinition, _super);
    function SideDrawerSectionDefinition(path, data) {
        var _this = _super.call(this, path, data) || this;
        _this._visible = true;
        _this._preserveImageSpacing = true;
        _this._styles = {};
        _this._separatorEnabled = true;
        if (!_this.data || !_this.data.Items) {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_SIDEDRAWER_SECTION_FIELD_ITEMS_MISSING);
        }
        _this._caption = data.Caption;
        if (data.Visible !== undefined) {
            _this._visible = data.Visible;
        }
        if (data.PreserveImageSpacing !== undefined) {
            _this._preserveImageSpacing = data.PreserveImageSpacing;
        }
        _this._loadItems();
        _this._styles = data.Styles;
        if (data.SeparatorEnabled !== undefined) {
            _this._separatorEnabled = data.SeparatorEnabled;
        }
        return _this;
    }
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "caption", {
        get: function () {
            return this._caption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "preserveImageSpacing", {
        get: function () {
            return this._preserveImageSpacing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerSectionDefinition.prototype, "separatorEnabled", {
        get: function () {
            return this._separatorEnabled;
        },
        enumerable: true,
        configurable: true
    });
    SideDrawerSectionDefinition.prototype._loadItems = function () {
        if (this.data.Items instanceof Array) {
            this._items = [];
            for (var _i = 0, _a = this.data.Items; _i < _a.length; _i++) {
                var item = _a[_i];
                try {
                    this._items.push(new SideDrawerItemDefinition_1.SideDrawerItemDefinition('', item));
                }
                catch (e) {
                    Logger_1.Logger.instance.ui.error(e);
                }
            }
        }
        else {
            this._items = this.data.Items;
        }
    };
    return SideDrawerSectionDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.SideDrawerSectionDefinition = SideDrawerSectionDefinition;
