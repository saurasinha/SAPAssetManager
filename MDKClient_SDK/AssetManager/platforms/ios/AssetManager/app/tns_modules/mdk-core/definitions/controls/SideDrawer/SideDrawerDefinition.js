"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SideDrawerSectionDefinition_1 = require("./SideDrawerSectionDefinition");
var SideDrawerHeaderDefinition_1 = require("./SideDrawerHeaderDefinition");
var BaseControlDefinition_1 = require("../BaseControlDefinition");
var ErrorMessage_1 = require("../../../errorHandling/ErrorMessage");
var Logger_1 = require("../../../utils/Logger");
var SideDrawerDefinition = (function (_super) {
    __extends(SideDrawerDefinition, _super);
    function SideDrawerDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this._clearHistory = false;
        _this._sections = [];
        _this._alwaysShowDrawerButton = false;
        if (!_this.data || !_this.data.Sections) {
            throw new Error(ErrorMessage_1.ErrorMessage.MANDATORY_SIDEDRAWER_FIELD_SECTIONS_MISSING);
        }
        if (data.ClearHistory !== undefined) {
            _this._clearHistory = data.ClearHistory;
        }
        _this._styles = data.Styles;
        _this._drawerButton = data.DrawerButton;
        if (data.AlwaysShowDrawerButton !== undefined) {
            _this._alwaysShowDrawerButton = data.AlwaysShowDrawerButton;
        }
        _this._loadHeader();
        _this._loadSections();
        return _this;
    }
    Object.defineProperty(SideDrawerDefinition.prototype, "clearHistory", {
        get: function () {
            return this._clearHistory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerDefinition.prototype, "header", {
        get: function () {
            return this._header;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerDefinition.prototype, "sections", {
        get: function () {
            return this._sections;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerDefinition.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerDefinition.prototype, "drawerButton", {
        get: function () {
            return this._drawerButton ? this._drawerButton : 'res://menu';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SideDrawerDefinition.prototype, "alwaysShowDrawerButton", {
        get: function () {
            return this._alwaysShowDrawerButton;
        },
        enumerable: true,
        configurable: true
    });
    SideDrawerDefinition.prototype._loadHeader = function () {
        if (this.data.Header !== undefined) {
            this._header = new SideDrawerHeaderDefinition_1.SideDrawerHeaderDefinition('', this.data.Header);
        }
    };
    SideDrawerDefinition.prototype._loadSections = function () {
        for (var _i = 0, _a = this.data.Sections; _i < _a.length; _i++) {
            var section_1 = _a[_i];
            try {
                this._sections.push(new SideDrawerSectionDefinition_1.SideDrawerSectionDefinition('', section_1));
            }
            catch (e) {
                Logger_1.Logger.instance.ui.error(e);
            }
        }
    };
    return SideDrawerDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.SideDrawerDefinition = SideDrawerDefinition;
