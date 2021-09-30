"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("./BaseControl");
var content_view_1 = require("tns-core-modules/ui/content-view");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var FlexibleColumnFrame_1 = require("../pages/FlexibleColumnFrame");
var grid_layout_1 = require("tns-core-modules/ui/layouts/grid-layout");
var PageRenderer_1 = require("../pages/PageRenderer");
var platform_1 = require("tns-core-modules/platform");
var color_1 = require("tns-core-modules/color");
var MDKFrame_1 = require("../pages/MDKFrame");
var ClientSettings_1 = require("../storage/ClientSettings");
var app = require("tns-core-modules/application");
var FlexibleColumnLayout = (function (_super) {
    __extends(FlexibleColumnLayout, _super);
    function FlexibleColumnLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._marginTop = 0;
        _this._columnFrames = [];
        _this._columnItems = [];
        _this._columnItemSpecs = [];
        _this._columnSpecRatios = [1, 2];
        return _this;
    }
    FlexibleColumnLayout.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        this._controlData = controlData;
        this._layoutView = new grid_layout_1.GridLayout();
        this._layoutView.id = controlData.container.getName() + '_' + FlexibleColumnLayout.LAYOUTTYPE_TAG;
    };
    FlexibleColumnLayout.prototype.buildLayout = function () {
        this.configureFrameMargin();
        this._flexColumnLayoutDefinition = this._controlData.container.getFlexibleColumnLayout();
        if (this._flexColumnLayoutDefinition) {
            var renderingPages = [];
            var startColumnDef = this._flexColumnLayoutDefinition.getStartColumn();
            if (startColumnDef && startColumnDef.PageToOpen) {
                renderingPages.push(startColumnDef.PageToOpen);
            }
            if (platform_1.device.deviceType === 'Tablet') {
                var endColumnDef = this._flexColumnLayoutDefinition.getEndColumn();
                if (endColumnDef && endColumnDef.PageToOpen) {
                    renderingPages.push(endColumnDef.PageToOpen);
                }
            }
            for (var i = 0; i < renderingPages.length; i++) {
                this.buildColumn(i);
            }
            for (var i = 0; i < this._columnItems.length; i++) {
                this.addColumnInLayout(i);
            }
            for (var i = 0; i < renderingPages.length; i++) {
                PageRenderer_1.PageRenderer.pushNavigation(renderingPages[i], false, null, null, null, this._columnFrames[i]);
            }
        }
        return Promise.resolve(this._layoutView);
    };
    FlexibleColumnLayout.prototype.extendFlexibleColumnFrame = function () {
        if (platform_1.device.deviceType === 'Tablet') {
            var index_1 = this._columnFrames.length;
            if (index_1 < FlexibleColumnLayout.MAXIMUM_COLUMN) {
                this.buildColumn(index_1);
                this.addColumnInLayout(index_1);
                return this._columnFrames[index_1];
            }
        }
        return null;
    };
    FlexibleColumnLayout.prototype.closeFlexibleColumnFrame = function (index) {
        if (platform_1.device.deviceType === 'Tablet') {
            if (index < FlexibleColumnLayout.MAXIMUM_COLUMN && index > 0 && index < this._columnFrames.length) {
                this.resetLayoutView();
                for (var i = 0; i < this._columnFrames.length - index; i++) {
                    this._columnItems.pop();
                    this._columnItemSpecs.pop();
                    this._columnFrames.pop();
                }
                for (var i = 0; i < this._columnItems.length; i++) {
                    this.addColumnInLayout(i);
                }
            }
        }
    };
    FlexibleColumnLayout.prototype.getNextFlexibileColumnFrame = function (frame) {
        if (platform_1.device.deviceType === 'Tablet') {
            var index_2 = this.getFlexibileColumnIndex(frame.id);
            if (index_2 >= 0 && index_2 + 1 < FlexibleColumnLayout.MAXIMUM_COLUMN) {
                if (this._columnFrames[index_2 + 1]) {
                    return this._columnFrames[index_2 + 1];
                }
                else {
                    var extendColumnFrame = this.extendFlexibleColumnFrame();
                    if (extendColumnFrame) {
                        return extendColumnFrame;
                    }
                }
            }
        }
        return frame;
    };
    FlexibleColumnLayout.prototype.getTopMostFlexibleColumnFrame = function () {
        if (this._columnFrames.length > 0) {
            var index_3 = this._columnFrames.length - 1;
            return this._columnFrames[index_3];
        }
        else {
            return null;
        }
    };
    FlexibleColumnLayout.prototype.getAllFlexibleColumnFrames = function (frame) {
        if (frame && frame.id) {
            var colIndex = this.getFlexibileColumnIndex(frame.id);
            if (colIndex >= 0 && colIndex < this._columnFrames.length) {
                var colFrames = [];
                for (var i = 0; i < colIndex + 1; i++) {
                    colFrames.push(this._columnFrames[i]);
                }
                return colFrames;
            }
        }
        return this._columnFrames;
    };
    FlexibleColumnLayout.prototype.isTopMostFlexibleColumnFrame = function (frame) {
        var index = this.getFlexibileColumnIndex(frame.id);
        if (this._columnFrames.length > 0 && index > -1 && index === this._columnFrames.length - 1) {
            return true;
        }
        else {
            return false;
        }
    };
    FlexibleColumnLayout.prototype.isEndFlexibleColumnFrame = function (frame) {
        var index = this.getFlexibileColumnIndex(frame.id);
        if (index > -1 && index === FlexibleColumnLayout.MAXIMUM_COLUMN - 1) {
            return true;
        }
        else {
            return false;
        }
    };
    FlexibleColumnLayout.prototype.getNeighborColumnDefinition = function (frame) {
        var index = this.getFlexibileColumnIndex(frame.id);
        if (this._columnFrames.length > 0 && index > -1 && index < this._columnFrames.length - 1) {
            if (index === 0) {
                return this._flexColumnLayoutDefinition.getEndColumn();
            }
        }
        return null;
    };
    FlexibleColumnLayout.prototype.isLayoutExpanded = function () {
        return this._layoutView.getChildrenCount() > 1;
    };
    FlexibleColumnLayout.getFlexibleColumnLayoutControl = function (page) {
        for (var _i = 0, _a = page.controls; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control instanceof FlexibleColumnLayout) {
                return control;
            }
        }
        return null;
    };
    FlexibleColumnLayout.prototype.redraw = function () {
        return Promise.resolve();
    };
    FlexibleColumnLayout.prototype.view = function () {
        return this._layoutView;
    };
    FlexibleColumnLayout.prototype.setStyle = function (style, target) {
    };
    FlexibleColumnLayout.prototype.configureFrameMargin = function () {
        var pageActionItems = this._controlData.container.getActionBarItems();
        var pageCaption = this._controlData.container.getCaption();
        var frame = MDKFrame_1.MDKFrame.getRootFrame();
        var enableBackBtn = false;
        if (frame && (frame.backStack.length > 0 || (frame.backStack.length === 0 && frame.currentPage))) {
            enableBackBtn = true;
        }
        this._marginTop = !enableBackBtn && pageActionItems.length === 0 && !pageCaption ? 0 : 0.1;
    };
    FlexibleColumnLayout.prototype.getGridLayoutColumnPosition = function (index, rtl) {
        if (rtl) {
            return this._columnItems.length - index - 1;
        }
        else {
            return index;
        }
    };
    FlexibleColumnLayout.prototype.buildColumn = function (index) {
        var columnSpec = new grid_layout_1.ItemSpec(this._columnSpecRatios[index], grid_layout_1.GridUnitType.STAR);
        this._columnItemSpecs.push(columnSpec);
        var columnFrameId = this._layoutView.id + '_' + FlexibleColumnFrame_1.FlexibleColumnFrame.COLUMN_TAG + '_' + index;
        var columnFrame = new FlexibleColumnFrame_1.FlexibleColumnFrame(columnFrameId, this._controlData.page);
        this._columnFrames.push(columnFrame);
        var column = new stack_layout_1.StackLayout();
        column.addChild(columnFrame);
        column.marginTop = this._marginTop;
        this._columnItems.push(column);
    };
    FlexibleColumnLayout.prototype.addColumnInLayout = function (index) {
        var rtl = ClientSettings_1.ClientSettings.getAppLanguageIsRTL();
        var separatorWidth = app.ios ? '1px' : '2px';
        var colIndex = this.getGridLayoutColumnPosition(index, rtl);
        this._columnItems[index].col = colIndex;
        if (rtl) {
            this._columnItems[index].borderRightWidth = content_view_1.Length.parse(separatorWidth);
            this._columnItems[index].borderRightColor = new color_1.Color('#888888');
        }
        else {
            this._columnItems[index].borderLeftWidth = content_view_1.Length.parse(separatorWidth);
            this._columnItems[index].borderLeftColor = new color_1.Color('#888888');
        }
        this._layoutView.addColumn(this._columnItemSpecs[colIndex]);
        this._layoutView.addChild(this._columnItems[index]);
    };
    FlexibleColumnLayout.prototype.resetLayoutView = function () {
        for (var i = 0; i < this._columnItems.length; i++) {
            this._layoutView.removeChild(this._columnItems[i]);
            this._layoutView.removeColumn(this._columnItemSpecs[i]);
        }
        this._layoutView.requestLayout();
    };
    FlexibleColumnLayout.prototype.getFlexibileColumnIndex = function (frameId) {
        var idSeparator = '_' + FlexibleColumnLayout.LAYOUTTYPE_TAG + '_';
        var idElements = frameId.split(idSeparator);
        if (idElements[0] && idElements[1] && idElements[1].indexOf(FlexibleColumnFrame_1.FlexibleColumnFrame.COLUMN_TAG) !== -1) {
            var columnLabels = idElements[1].split('_');
            if (columnLabels[1]) {
                return parseInt(columnLabels[1], 10);
            }
        }
        return -1;
    };
    FlexibleColumnLayout.LAYOUTTYPE_TAG = 'FlexibleColumnLayout';
    FlexibleColumnLayout.MAXIMUM_COLUMN = 2;
    return FlexibleColumnLayout;
}(BaseControl_1.BaseControl));
exports.FlexibleColumnLayout = FlexibleColumnLayout;
;
