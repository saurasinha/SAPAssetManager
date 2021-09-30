"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSectionObservable_1 = require("./BaseTableSectionObservable");
var GridRowBuilder_1 = require("../../builders/sections/GridRowBuilder");
var Context_1 = require("../../context/Context");
var GridTableSectionObservable = (function (_super) {
    __extends(GridTableSectionObservable, _super);
    function GridTableSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridTableSectionObservable.prototype._bindRowProperties = function (row, bindingObject, definition) {
        var gridSectionDefinition = this.section.definition;
        var rowDefinition = gridSectionDefinition.row;
        return this._bindGridRow(bindingObject, rowDefinition);
    };
    GridTableSectionObservable.prototype._bindValues = function (bindingObject, definition) {
        var _this = this;
        return _super.prototype._bindValues.call(this, bindingObject, definition).then(function (sectionParameters) {
            var gridSectionDefinition = _this.section.definition;
            var headerRowDefinition = gridSectionDefinition.headerRow;
            if (headerRowDefinition) {
                return _this._bindGridRow(bindingObject, headerRowDefinition).then(function (rowParameters) {
                    rowParameters.accessoryType = gridSectionDefinition.row.accessoryType;
                    sectionParameters[GridTableSectionObservable._headerGridParamKey] = rowParameters;
                    return sectionParameters;
                });
            }
            else {
                return sectionParameters;
            }
        });
    };
    GridTableSectionObservable.prototype._definitionUsesStaticCells = function () {
        return false;
    };
    GridTableSectionObservable.prototype._getRowOnPressAction = function (row, action, source) {
        var gridSectionDefinition = this.section.definition;
        var onPress = undefined;
        if (action === 'OnAccessoryButtonPress') {
            onPress = gridSectionDefinition.row.onAccessoryButtonPress;
        }
        else {
            onPress = gridSectionDefinition.row.onPress;
        }
        return onPress;
    };
    GridTableSectionObservable.prototype._getSearchKeys = function () {
        return [];
    };
    GridTableSectionObservable.prototype._bindGridRow = function (bindingObject, rowDefinition) {
        var _this = this;
        var context = new Context_1.Context(bindingObject, this.section.table);
        var rowBuilder = new GridRowBuilder_1.GridRowBuilder(context);
        rowBuilder.setAccessoryType(rowDefinition.accessoryType);
        rowBuilder.setDisableSelectionStyle(rowDefinition.onPress === undefined || rowDefinition.onPress === '');
        if (rowDefinition.layout) {
            rowBuilder.setColumnWidth(rowDefinition.layout.columnWidth)
                .setColumnWidthPercentage(rowDefinition.layout.columnWidthPercentage)
                .setSpacing(rowDefinition.layout.spacing);
        }
        var rowItemImageDef = [];
        rowDefinition.items.forEach(function (rowItem) {
            rowItemImageDef.push(rowItem.image ? rowItem.image : '');
            rowBuilder.newItem
                .setImageSizeAffectsRowHeight(rowItem.imageSizeAffectsRowHeight)
                .setLineBreakMode(rowItem.lineBreakMode)
                .setNumberOfLines(rowItem.numberOfLines)
                .setStyle(rowItem.style)
                .setText(rowItem.text)
                .setTextAlignment(rowItem.textAlignment)
                .setBindTo(rowItem.bindTo);
        });
        return rowBuilder.build().then(function (rowData) {
            var itemImagePromises = [];
            var i = 0;
            var imageKey = GridTableSectionObservable._gridImageKey;
            rowData.items.forEach(function (item) {
                if (rowItemImageDef[i] !== '') {
                    itemImagePromises.push(_this._bindValue(bindingObject, imageKey, rowItemImageDef[i], item.style).then(function (value) {
                        item[imageKey] = value;
                    }));
                }
                i++;
            });
            return Promise.all(itemImagePromises).then(function () {
                return rowData;
            });
        });
    };
    GridTableSectionObservable._headerGridParamKey = 'headerGrid';
    GridTableSectionObservable._gridImageKey = 'image';
    return GridTableSectionObservable;
}(BaseTableSectionObservable_1.BaseTableSectionObservable));
exports.GridTableSectionObservable = GridTableSectionObservable;
