"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("../sections/BaseSectionObservable");
var Logger_1 = require("../../utils/Logger");
var AppSettingsManager_1 = require("../../utils/AppSettingsManager");
var Context_1 = require("../../context/Context");
var ButtonSectionObservable = (function (_super) {
    __extends(ButtonSectionObservable, _super);
    function ButtonSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ENABLED_PARAM_KEY = 'Enabled';
        _this.ITEMS_PARAM_KEY = 'items';
        _this.STYLE_TEXT_PARAM_KEY = 'Style';
        _this.TEXT_ALIGNMENT_PARAM_KEY = 'TextAlignment';
        _this.TITLE_TEXT_PARAM_KEY = 'Title';
        _this.VISIBLE_PARAM_KEY = 'visible';
        _this._blockingUserInteraction = false;
        return _this;
    }
    ButtonSectionObservable.prototype.bind = function () {
        var _this = this;
        this._staticCells = true;
        this.buttonID = 0;
        return _super.prototype.bind.call(this).then(function () {
            var def = _this.section.definition;
            var buttons = def.Buttons;
            var allPromises = [];
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var button = buttons_1[_i];
                allPromises.push(_this._bindButton(button));
            }
            return Promise.all(allPromises).then(function (items) {
                _this.sectionParameters[_this.ITEMS_PARAM_KEY] = _this._filterCells(items);
                return _this._sectionParameters;
            });
        });
    };
    ButtonSectionObservable.prototype.onPress = function (cell) {
        var _this = this;
        var handler = this.buildBaseSectionEventHandler();
        var adjustedCell = this.adjustForHiddenRows(cell);
        var button = this._getItem(adjustedCell);
        if (!button) {
            Logger_1.Logger.instance.ui.error(Logger_1.Logger.NO_SELECTED_ITEM_FOR_ROW, adjustedCell);
            return undefined;
        }
        this._blockUserInteraction(button, handler.getEventSource());
        return handler.executeActionOrRule(this._onPressHandler(button), this.section.context)
            .catch(function (error) {
            _this._unblockUserInteraction(button);
            Logger_1.Logger.instance.ui.error(error + " " + error.stack);
        }).then(function () {
            _this._unblockUserInteraction(button);
        });
    };
    ButtonSectionObservable.prototype.onAppSettingChange = function (key, type, value) {
        if (type === AppSettingsManager_1.AppSettingsManager.changeType.KeyRemoved) {
            AppSettingsManager_1.AppSettingsManager.instance().unsubscribe(key, this);
            this.redraw();
        }
    };
    ButtonSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    ButtonSectionObservable.prototype._allowUserInteraction = function (button) {
        if (!button.OnPress || !button.OnPress.UserInteraction) {
            return true;
        }
        var ui = button.OnPress.UserInteraction;
        if (ui.Enabled === undefined) {
            return true;
        }
        return !!ui.Enabled;
    };
    ButtonSectionObservable.prototype._blockUserInteraction = function (button, source) {
        if (!this._allowUserInteraction(button)) {
            this._blockingUserInteraction = true;
            var page = undefined;
            var pageContext = Context_1.Context.fromPage(source);
            if (pageContext) {
                page = pageContext.element.definition.name;
            }
            AppSettingsManager_1.AppSettingsManager.instance().addPendingAction(this._onPressHandlerKey(button), page);
            this.redraw();
        }
    };
    ButtonSectionObservable.prototype._bindButton = function (button) {
        var _this = this;
        var promises = [];
        var item = {};
        item[ButtonSectionObservable._objectID] = this.buttonID++;
        if (this._userInteractionBlocked(button) && !this._blockingUserInteraction) {
            AppSettingsManager_1.AppSettingsManager.instance().subscribe(this._onPressHandlerKey(button), this);
        }
        this._setDisableSelectionStyle(button, item);
        var mappedKeys = Object.keys(button).map(function (metadataKey) {
            return _this._mapMetadataKey(metadataKey);
        }).filter(function (filterKey) {
            return filterKey !== undefined;
        });
        promises.push(this._bindValue(this.binding, this.ENABLED_PARAM_KEY, true).then(function (value) {
            item[_this.ENABLED_PARAM_KEY] = value;
        }));
        promises.push(this._bindValue(this.binding, ButtonSectionObservable.VISIBLE_DEFINITION_KEY, button[ButtonSectionObservable.VISIBLE_DEFINITION_KEY]).then(function (visible) {
            if (visible !== undefined) {
                item[_this.VISIBLE_PARAM_KEY] = visible;
            }
        }));
        mappedKeys.forEach(function (buttonKey) {
            if (buttonKey === 'Title' && _this._userInteractionBlocked(button)) {
                promises.push(_this._bindUserInteraction(item, button, buttonKey));
            }
            else {
                promises.push(_this._bindValue(_this.binding, buttonKey, button[buttonKey]).then(function (value) {
                    if (typeof (value) !== 'string') {
                        item[buttonKey] = value.toString();
                    }
                    else {
                        item[buttonKey] = value;
                    }
                }));
            }
        });
        return Promise.all(promises).then(function () {
            return item;
        });
    };
    ButtonSectionObservable.prototype._bindUserInteraction = function (item, button, key) {
        var _this = this;
        if (key === 'Title') {
            if (button.OnPress && typeof button.OnPress === 'string') {
                return this._bindValue(this.binding, key, button.OnPress).then(function (value) {
                    item[key] = value;
                });
            }
            else if (typeof button.OnPress === 'object') {
                var title = button.OnPress.UserInteraction.Title || button.Title;
                return this._bindValue(this.binding, key, title).then(function (value) {
                    item[key] = value;
                }).then(function () {
                    var enabled = true;
                    if (button.OnPress.UserInteraction.Enabled !== undefined) {
                        enabled = button.OnPress.UserInteraction.Enabled;
                    }
                    return _this._bindValue(_this.binding, _this.ENABLED_PARAM_KEY, enabled).then(function (value) {
                        item[_this.ENABLED_PARAM_KEY] = value;
                    });
                });
            }
        }
        return Promise.resolve(undefined);
    };
    ButtonSectionObservable.prototype._getItem = function (row) {
        var definition = this.section.definition;
        if (definition && definition !== undefined && row <= definition.Buttons.length) {
            return definition.Buttons[row];
        }
    };
    ButtonSectionObservable.prototype._mapMetadataKey = function (key) {
        switch (key) {
            case 'Style':
                return this.STYLE_TEXT_PARAM_KEY;
            case 'Title':
                return this.TITLE_TEXT_PARAM_KEY;
            case 'OnPress':
                return undefined;
            case 'TextAlignment':
                return this.TEXT_ALIGNMENT_PARAM_KEY;
            default:
                Logger_1.Logger.instance.ui.log("unrecognized key " + key);
                return undefined;
        }
    };
    ButtonSectionObservable.prototype._onPressHandler = function (button) {
        if (button.OnPress && typeof button.OnPress === 'string') {
            return button.OnPress;
        }
        else if (typeof button.OnPress === 'object') {
            if (button.OnPress.Handler) {
                return button.OnPress.Handler;
            }
            else if (button.OnPress.Name && button.OnPress.Properties) {
                return button.OnPress;
            }
        }
        return undefined;
    };
    ButtonSectionObservable.prototype._onPressHandlerKey = function (button) {
        if (button.OnPress && typeof button.OnPress === 'string') {
            return button.OnPress;
        }
        else if (typeof button.OnPress === 'object') {
            if (button.OnPress.Handler) {
                return button.OnPress.Handler;
            }
            else if (button.OnPress.Name) {
                return button.OnPress.Name;
            }
        }
        return undefined;
    };
    ButtonSectionObservable.prototype._unblockUserInteraction = function (button) {
        AppSettingsManager_1.AppSettingsManager.instance().removePendingAction(this._onPressHandlerKey(button));
        this.redraw();
    };
    ButtonSectionObservable.prototype._userInteractionBlocked = function (button) {
        return AppSettingsManager_1.AppSettingsManager.instance().hasPendingActionForKey(this._onPressHandlerKey(button));
    };
    ButtonSectionObservable.VISIBLE_DEFINITION_KEY = 'Visible';
    ButtonSectionObservable._objectID = 'ObjectID';
    return ButtonSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.ButtonSectionObservable = ButtonSectionObservable;
