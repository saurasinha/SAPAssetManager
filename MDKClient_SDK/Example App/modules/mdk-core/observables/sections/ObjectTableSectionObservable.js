"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSectionObservable_1 = require("./BaseTableSectionObservable");
var ValueResolver_1 = require("../../utils/ValueResolver");
var Context_1 = require("../../context/Context");
var TypeConverter_1 = require("../../utils/TypeConverter");
var CellUtil_1 = require("../common/CellUtil");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ObjectTableSectionDefinition_1 = require("../../definitions/sections/ObjectTableSectionDefinition");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var Logger_1 = require("../../utils/Logger");
var app = require("tns-core-modules/application");
var MDKPage_1 = require("../../pages/MDKPage");
var TabFrame_1 = require("../../pages/TabFrame");
var DataHelper_1 = require("../../utils/DataHelper");
var CommonUtil_1 = require("../../utils/CommonUtil");
var ObjectTableSectionObservable = (function (_super) {
    __extends(ObjectTableSectionObservable, _super);
    function ObjectTableSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectTableSectionObservable.prototype.searchUpdated = function (searchText) {
        if (app.ios) {
            if (!this.section.isInNavigation() ||
                (this.section.page instanceof MDKPage_1.MDKPage &&
                    (TabFrame_1.TabFrame.isTabsTabFrame(this.section.page.frame) ||
                        TabFrame_1.TabFrame.isChildTabs(this.section.page.frame) ||
                        TabFrame_1.TabFrame.isSideDrawerTabFrame(this.section.page.frame)))) {
                return _super.prototype.searchUpdated.call(this, searchText);
            }
            else {
                return Promise.resolve();
            }
        }
        else {
            return _super.prototype.searchUpdated.call(this, searchText);
        }
    };
    ObjectTableSectionObservable.prototype._bindRowProperties = function (row, bindingObject, definition) {
        var _this = this;
        var item = {};
        item[ObjectTableSectionObservable._objectID] = row;
        var promises = [];
        var objectCell = definition.objectCell;
        this._setDisableSelectionStyle(objectCell, item);
        return this._bindStyles(objectCell, bindingObject).then(function (styles) {
            if (styles) {
                item[ObjectTableSectionObservable._stylesKey] = styles;
            }
            Object.keys(objectCell).forEach(function (key) {
                if (key !== 'OnPress' && key !== 'OnAccessoryButtonPress' &&
                    key !== 'Styles') {
                    var oContext = new Context_1.Context(bindingObject, _this.section.table);
                    if (key === 'Icons') {
                        promises.push(ValueResolver_1.ValueResolver.resolveValue(objectCell[key], oContext).then(function (result) {
                            var aIcons = TypeConverter_1.TypeConverter.toArray(result);
                            return Promise.all(aIcons.map(function (image, index) {
                                return _this._bindValue(bindingObject, key + index, image);
                            })).then(function (images) {
                                var validImages = images.filter(function (imageString) {
                                    return imageString !== undefined && imageString !== null &&
                                        imageString !== '' && imageString.length > 0;
                                });
                                if (validImages.length) {
                                    item[key] = validImages;
                                }
                            });
                        }));
                    }
                    else if (key === 'Visible') {
                        promises.push(_this._bindValue(bindingObject, key, objectCell[key]).then(function (value) {
                            item[_this._visibleKey] = value;
                        }));
                    }
                    else {
                        var resolvableValue_1 = objectCell[key];
                        if (key === 'ContextMenu') {
                            var menus = CommonUtil_1.CommonUtil.deepCopyWithoutKey(resolvableValue_1, 'OnSwipe');
                            promises.push(_this._bindValue(bindingObject, key, menus, styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                CommonUtil_1.CommonUtil.addKeyToObjectFromObject(resolvableValue_1.Items, value.Items, '_Name', 'OnSwipe');
                                item[key] = value;
                            }));
                        }
                        else {
                            promises.push(_this._bindValue(bindingObject, key, resolvableValue_1, styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                item[key] = value;
                            }));
                        }
                    }
                }
            });
            return Promise.all(promises).then(function () {
                return item;
            }).catch(function (error) {
                Logger_1.Logger.instance.valueResolver.error("Fail to bind row properties: " + error + "\n" + error.stack);
                return item;
            });
        });
    };
    ObjectTableSectionObservable.prototype._createStaticCellsData = function () {
        var _this = this;
        var definition = this.section.definition;
        return Promise.all(definition.objectCells).then(function (objectCells) {
            return new observable_array_1.ObservableArray(objectCells.map(function (objectCell) {
                return new ObjectTableSectionDefinition_1.ObjectTableSectionDefinition('', objectCell, _this);
            }));
        });
    };
    ObjectTableSectionObservable.prototype._definitionUsesStaticCells = function () {
        var definition = this.section.definition;
        return !!definition.objectCells;
    };
    ObjectTableSectionObservable.prototype._getRowOnPressAction = function (row, action, source) {
        var onPress = undefined;
        if (this._definitionUsesStaticCells() &&
            this.selectedItem.selectedItem instanceof ObjectTableSectionDefinition_1.ObjectTableSectionDefinition) {
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
                onPress = this.section.definition.objectCell.OnAccessoryButtonPress;
            }
            else {
                onPress = this.section.definition.onPress;
            }
        }
        return onPress;
    };
    ObjectTableSectionObservable.prototype._getSearchKeys = function () {
        var searchKeys = [];
        var definition = this.section.definition;
        var objectCell = definition.objectCell;
        if (objectCell) {
            var service = definition.target && definition.target.Service ? definition.target.Service : '';
            var isEntitySetResolvable = definition.target ? ValueResolver_1.ValueResolver.canResolve(definition.target.EntitySet) : false;
            for (var _i = 0, _a = CellUtil_1.CellUtil.objectCellSearchKeys; _i < _a.length; _i++) {
                var key = _a[_i];
                var value = objectCell[key];
                if (PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(value)
                    || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(value)
                    || PropertyTypeChecker_1.PropertyTypeChecker.isBinding(value)
                    || PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(value)
                    || PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(value)) {
                    var props = CellUtil_1.CellUtil.parsePropertyName(value);
                    if (props && props.length > 0) {
                        for (var _b = 0, props_1 = props; _b < props_1.length; _b++) {
                            var prop = props_1[_b];
                            if (searchKeys.indexOf(prop) === -1 && prop.indexOf('/#') === -1 && (isEntitySetResolvable || DataHelper_1.DataHelper.isSearchableProperty(definition.target, prop))) {
                                searchKeys.push(prop);
                            }
                        }
                    }
                }
            }
        }
        return searchKeys;
    };
    ObjectTableSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    ObjectTableSectionObservable._itemsParamKey = 'items';
    ObjectTableSectionObservable._objectID = 'ObjectID';
    return ObjectTableSectionObservable;
}(BaseTableSectionObservable_1.BaseTableSectionObservable));
exports.ObjectTableSectionObservable = ObjectTableSectionObservable;
