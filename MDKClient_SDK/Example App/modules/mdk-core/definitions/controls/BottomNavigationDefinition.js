"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var TabItemDefinition_1 = require("./TabItemDefinition");
var BottomNavigationDefinition = (function (_super) {
    __extends(BottomNavigationDefinition, _super);
    function BottomNavigationDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this.items = [];
        _this._hideTabStrips = false;
        _this._selectedIndex = 0;
        if (!_this.data || !_this.data.Items) {
            return _this;
        }
        for (var _i = 0, _a = _this.data.Items; _i < _a.length; _i++) {
            var itemDef = _a[_i];
            var tabItemDef = undefined;
            tabItemDef = new TabItemDefinition_1.TabItemDefinition('', itemDef, _this);
            _this.items.push(tabItemDef);
        }
        _this._styles = data.Styles;
        if (data.HideTabStrips) {
            _this._hideTabStrips = true;
        }
        if (data.SelectedIndex) {
            _this._selectedIndex = data.SelectedIndex;
        }
        return _this;
    }
    BottomNavigationDefinition.prototype.getItemsCount = function () {
        return this.items.length;
    };
    BottomNavigationDefinition.prototype.getItems = function () {
        return this.items;
    };
    Object.defineProperty(BottomNavigationDefinition.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BottomNavigationDefinition.prototype, "hideTabStrips", {
        get: function () {
            return this._hideTabStrips;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BottomNavigationDefinition.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        enumerable: true,
        configurable: true
    });
    return BottomNavigationDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.BottomNavigationDefinition = BottomNavigationDefinition;
;
