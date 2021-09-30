"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSectionObservable_1 = require("../sections/BaseTableSectionObservable");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ContactCellSectionDefinition_1 = require("../../definitions/sections/ContactCellSectionDefinition");
var Context_1 = require("../../context/Context");
var Logger_1 = require("../../utils/Logger");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var CellUtil_1 = require("../common/CellUtil");
var CommonUtil_1 = require("../../utils/CommonUtil");
var ContactCellSectionObservable = (function (_super) {
    __extends(ContactCellSectionObservable, _super);
    function ContactCellSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContactCellSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        if (Array.isArray(definition.data.ContactCell)) {
            return Promise.all(definition.data.ContactCell).then(function (contactCells) {
                _this._staticCells = true;
                return new observable_array_1.ObservableArray(contactCells.map(function (contactCell) {
                    var contactCellWithNewStyle = Object.create({}, { ContactCell: { value: contactCell } });
                    return new ContactCellSectionDefinition_1.ContactCellSectionDefinition('', contactCellWithNewStyle, _this);
                }));
            });
        }
        else {
            return _super.prototype._resolveData.call(this, definition);
        }
    };
    ContactCellSectionObservable.prototype._createStaticCellsData = function () {
        var _this = this;
        var definition = this.section.definition;
        return Promise.all(definition.ContactCells).then(function (contactCells) {
            return new observable_array_1.ObservableArray(contactCells.map(function (contactCell) {
                return new ContactCellSectionDefinition_1.ContactCellSectionDefinition('', contactCell, _this);
            }));
        });
    };
    ContactCellSectionObservable.prototype._definitionUsesStaticCells = function () {
        var definition = this.section.definition;
        return !!definition.ContactCells || Array.isArray(definition.data.ContactCell);
    };
    ContactCellSectionObservable.prototype._getRowOnPressAction = function (row, action, source) {
        var onPress;
        if (this._definitionUsesStaticCells() &&
            this.selectedItem.selectedItem instanceof ContactCellSectionDefinition_1.ContactCellSectionDefinition) {
            if (action === 'OnAccessoryButtonPress') {
                onPress = this.selectedItem.selectedItem.onAccessoryButtonPress;
            }
            else {
                onPress = this.selectedItem.selectedItem.onPress;
            }
            this.section.page.context.clientAPIProps.actionBinding =
                Context_1.Context.fromPage(source).binding || this.selectedItem.selectedItem;
        }
        else {
            if (action === 'OnAccessoryButtonPress') {
                onPress = this.section.definition.ContactCell.OnAccessoryButtonPress;
            }
            else {
                onPress = this.section.definition.onPress;
            }
        }
        return onPress;
    };
    ContactCellSectionObservable.prototype._getSearchKeys = function () {
        var searchKeys = [];
        var contactCell = this.section.definition.ContactCell;
        var values = [];
        if (contactCell) {
            var searchParamKeys = [
                ContactCellSectionObservable._descriptionKey,
                ContactCellSectionObservable._headlineKey,
                ContactCellSectionObservable._subheadlineKey,
            ];
            for (var _i = 0, searchParamKeys_1 = searchParamKeys; _i < searchParamKeys_1.length; _i++) {
                var key = searchParamKeys_1[_i];
                var value = contactCell[key];
                values.push(value);
            }
            var activityItems = contactCell[ContactCellSectionObservable._activityItemsKey];
            if (activityItems) {
                contactCell[ContactCellSectionObservable._activityItemsKey].forEach(function (element) {
                    var value = element[ContactCellSectionObservable._avKey];
                    values.push(value);
                });
            }
        }
        return this._findSearchKeysFromValues(values);
    };
    ContactCellSectionObservable.prototype._bindRowProperties = function (row, bindingObject, definition) {
        var _this = this;
        var promises = [];
        var item = {};
        item[ContactCellSectionObservable._objectID] = row;
        var contactCell = definition.ContactCell;
        this._setDisableSelectionStyle(contactCell, item);
        return this._bindStyles(contactCell, bindingObject).then(function (styles) {
            if (styles) {
                item[ContactCellSectionObservable._stylesKey] = styles;
            }
            Object.keys(contactCell).forEach(function (key) {
                var cellKey = _this._keyToCellKey(key);
                if (cellKey && cellKey !== 'Styles') {
                    if (cellKey === 'ActivityItems') {
                        promises.push(Promise.all(contactCell[cellKey].map(function (activityItem) {
                            return _this._bindValue(bindingObject, cellKey, activityItem[ContactCellSectionObservable._avKey]).
                                then(function (value) {
                                var retItem = Object.assign({}, activityItem);
                                retItem[ContactCellSectionObservable._avKey] = value;
                                return retItem;
                            });
                        })).then(function (activityItemsResult) {
                            item[ContactCellSectionObservable._activityItemsKey] = activityItemsResult;
                        }));
                    }
                    else {
                        var resolvableValue_1 = contactCell[key];
                        if (key === 'ContextMenu') {
                            var menus = CommonUtil_1.CommonUtil.deepCopyWithoutKey(resolvableValue_1, 'OnSwipe');
                            promises.push(_this._bindValue(bindingObject, key, menus, styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                CommonUtil_1.CommonUtil.addKeyToObjectFromObject(resolvableValue_1.Items, value.Items, '_Name', 'OnSwipe');
                                item[cellKey] = value;
                            }));
                        }
                        else {
                            promises.push(_this._bindValue(bindingObject, key, resolvableValue_1, styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                item[cellKey] = value;
                            }));
                        }
                    }
                }
            });
            return Promise.all(promises).then(function () {
                return item;
            });
        });
    };
    ContactCellSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    ContactCellSectionObservable.prototype._keyToCellKey = function (key) {
        switch (key) {
            case 'Headline':
                return ContactCellSectionObservable._headlineKey;
            case 'Subheadline':
                return ContactCellSectionObservable._subheadlineKey;
            case 'Description':
                return ContactCellSectionObservable._descriptionKey;
            case 'DetailImage':
                return ContactCellSectionObservable._detailImageKey;
            case 'ActivityItems':
                return ContactCellSectionObservable._activityItemsKey;
            case 'Styles':
                return ContactCellSectionObservable._stylesKey;
            case 'ContextMenu':
                return ContactCellSectionObservable._contextMenuKey;
            case 'OnPress':
                return undefined;
            case 'Visible':
                return this._visibleKey;
            default:
                Logger_1.Logger.instance.ui.log("unrecognized key " + key);
                return undefined;
        }
    };
    ContactCellSectionObservable.prototype._findSearchKeysFromValues = function (values) {
        var searchKeys = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(value)
                || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(value)
                || PropertyTypeChecker_1.PropertyTypeChecker.isBinding(value)
                || PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(value)
                || PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(value)) {
                var props = CellUtil_1.CellUtil.parsePropertyName(value);
                if (props && props.length > 0) {
                    for (var _a = 0, props_1 = props; _a < props_1.length; _a++) {
                        var prop = props_1[_a];
                        if (searchKeys.indexOf(prop) === -1 && prop.indexOf('/#') === -1) {
                            searchKeys.push(prop);
                        }
                    }
                }
            }
        }
        return searchKeys;
    };
    ContactCellSectionObservable._objectID = 'ObjectID';
    ContactCellSectionObservable._descriptionKey = 'Description';
    ContactCellSectionObservable._detailImageKey = 'DetailImage';
    ContactCellSectionObservable._headlineKey = 'Headline';
    ContactCellSectionObservable._subheadlineKey = 'Subheadline';
    ContactCellSectionObservable._activityItemsKey = 'ActivityItems';
    ContactCellSectionObservable._avKey = 'ActivityValue';
    ContactCellSectionObservable._accessoryTypeKey = 'AccessoryType';
    ContactCellSectionObservable._contextMenuKey = 'ContextMenu';
    return ContactCellSectionObservable;
}(BaseTableSectionObservable_1.BaseTableSectionObservable));
exports.ContactCellSectionObservable = ContactCellSectionObservable;
