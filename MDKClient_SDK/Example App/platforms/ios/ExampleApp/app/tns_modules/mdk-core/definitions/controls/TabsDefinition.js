"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var TabItemDefinition_1 = require("./TabItemDefinition");
var TabsDefinition = (function (_super) {
    __extends(TabsDefinition, _super);
    function TabsDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this._items = [];
        _this._swipeEnabled = true;
        _this._visible = true;
        if (!_this.data || !_this.data.Items) {
            return _this;
        }
        for (var _i = 0, _a = _this.data.Items; _i < _a.length; _i++) {
            var itemDef = _a[_i];
            var tabItemDef = undefined;
            tabItemDef = new TabItemDefinition_1.TabItemDefinition('', itemDef, _this);
            _this._items.push(tabItemDef);
        }
        _this._styles = data.Styles;
        _this._position = data.Position;
        _this._selectedIndex = data.SelectedIndex;
        if (data.SwipeEnabled !== undefined) {
            _this._swipeEnabled = data.SwipeEnabled;
        }
        if (data.Visible !== undefined) {
            _this._visible = data.Visible;
        }
        return _this;
    }
    TabsDefinition.prototype.getItemsCount = function () {
        return this._items.length;
    };
    TabsDefinition.prototype.getItems = function () {
        return this._items;
    };
    Object.defineProperty(TabsDefinition.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsDefinition.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsDefinition.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsDefinition.prototype, "swipeEnabled", {
        get: function () {
            return this._swipeEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsDefinition.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    return TabsDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.TabsDefinition = TabsDefinition;
;
