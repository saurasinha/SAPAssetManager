"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var IDefinitionProvider_1 = require("../IDefinitionProvider");
var Logger_1 = require("../../utils/Logger");
var PopoverActionDefinition = (function (_super) {
    __extends(PopoverActionDefinition, _super);
    function PopoverActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(PopoverActionDefinition.prototype, "message", {
        get: function () {
            return this.data.Message;
        },
        enumerable: true,
        configurable: true
    });
    PopoverActionDefinition.prototype.getMessage = function () {
        return this.message;
    };
    Object.defineProperty(PopoverActionDefinition.prototype, "title", {
        get: function () {
            return this.data.Title;
        },
        enumerable: true,
        configurable: true
    });
    PopoverActionDefinition.prototype.getTitle = function () {
        return this.title;
    };
    Object.defineProperty(PopoverActionDefinition.prototype, "items", {
        get: function () {
            var itemDefs = [];
            for (var _i = 0, _a = this.data.PopoverItems; _i < _a.length; _i++) {
                var item = _a[_i];
                itemDefs.push(new PopoverItemDefinition(item));
            }
            return itemDefs;
        },
        enumerable: true,
        configurable: true
    });
    PopoverActionDefinition.prototype.getItemDefs = function () {
        return this.items;
    };
    return PopoverActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.PopoverActionDefinition = PopoverActionDefinition;
var PopoverItemDefinition = (function () {
    function PopoverItemDefinition(itemDefinition) {
        this.data = itemDefinition;
    }
    Object.defineProperty(PopoverItemDefinition.prototype, "title", {
        get: function () {
            return this.data.Title;
        },
        enumerable: true,
        configurable: true
    });
    PopoverItemDefinition.prototype.getTitle = function () {
        return this.title;
    };
    Object.defineProperty(PopoverItemDefinition.prototype, "icon", {
        get: function () {
            var iconPath = this.data.Icon;
            var iconDefinition = null;
            if (iconPath) {
                try {
                    var oData = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(iconPath);
                    iconDefinition = oData;
                }
                catch (error) {
                    Logger_1.Logger.instance.action.error(error);
                    iconDefinition = iconPath;
                }
            }
            return iconDefinition;
        },
        enumerable: true,
        configurable: true
    });
    PopoverItemDefinition.prototype.getIcon = function () {
        return this.icon;
    };
    Object.defineProperty(PopoverItemDefinition.prototype, "onPress", {
        get: function () {
            return this.data.OnPressAction || this.data.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    PopoverItemDefinition.prototype.getOnPressAction = function () {
        return this.onPress;
    };
    Object.defineProperty(PopoverItemDefinition.prototype, "visible", {
        get: function () {
            if (this.data.Visible === undefined) {
                return true;
            }
            return this.data.Visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopoverItemDefinition.prototype, "enabled", {
        get: function () {
            if (this.data.Enabled === undefined) {
                return true;
            }
            return this.data.Enabled;
        },
        enumerable: true,
        configurable: true
    });
    return PopoverItemDefinition;
}());
exports.PopoverItemDefinition = PopoverItemDefinition;
