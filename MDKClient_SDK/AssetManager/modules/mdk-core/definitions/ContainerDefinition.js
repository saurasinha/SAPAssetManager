"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("./BaseJSONDefinition");
var BaseControlDefinition_1 = require("./controls/BaseControlDefinition");
var ExtensionDefinition_1 = require("./controls/ExtensionDefinition");
var FormCellContainerDefinition_1 = require("./controls/FormCellContainerDefinition");
var SectionedTableDefinition_1 = require("./controls/SectionedTableDefinition");
var ToolbarItemDefinition_1 = require("./controls/ToolbarItemDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ListPickerFragmentContainerDefinition_1 = require("./controls/ListPickerFragmentContainerDefinition");
var BottomNavigationDefinition_1 = require("./controls/BottomNavigationDefinition");
var TabsDefinition_1 = require("./controls/TabsDefinition");
var SideDrawerDefinition_1 = require("./controls/SideDrawer/SideDrawerDefinition");
var SignatureCaptureFragmentContainerDefinition_1 = require("./controls/SignatureCaptureFragmentContainerDefinition");
var FlexibleColumnLayoutDefinition_1 = require("./controls/FlexibleColumnLayoutDefinition");
var application = require("tns-core-modules/application");
var Logger_1 = require("../utils/Logger");
var ContainerDefinition = (function (_super) {
    __extends(ContainerDefinition, _super);
    function ContainerDefinition(path, data) {
        var _this = _super.call(this, path, data) || this;
        _this.controls = [];
        _this._loadControls();
        return _this;
    }
    ContainerDefinition.prototype.getCaption = function () {
        return this.data.Caption;
    };
    ContainerDefinition.prototype.getControls = function () {
        return this.controls;
    };
    ContainerDefinition.prototype.isValidControl = function (type) {
        return true;
    };
    ContainerDefinition.prototype._loadControls = function () {
        var _this = this;
        this.controls = [];
        if (this.data.Controls) {
            this.data.Controls.forEach(function (controlData) {
                if (_this.isValidControl(controlData._Type)) {
                    switch (controlData._Type) {
                        case BaseControlDefinition_1.BaseControlDefinition.type.Extension:
                            _this.controls.push(new ExtensionDefinition_1.ExtensionDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable:
                            _this.controls.push(new SectionedTableDefinition_1.SectionedTableDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.FormCellContainer:
                            _this.controls.push(new FormCellContainerDefinition_1.FormCellContainerDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.BottomNavigation:
                            _this.controls.push(new BottomNavigationDefinition_1.BottomNavigationDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.Tabs:
                            _this.controls.push(new TabsDefinition_1.TabsDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.ToolbarItem:
                            _this.controls.push(new ToolbarItemDefinition_1.ToolbarItemDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.ListPickerFragmentContainer:
                            _this.controls.push(new ListPickerFragmentContainerDefinition_1.ListPickerFragmentContainerDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.SideDrawer:
                            if (application.ios || application.android) {
                                Logger_1.Logger.instance.ui.info('Page level SideDrawer not supported.');
                            }
                            else {
                                _this.controls.push(new SideDrawerDefinition_1.SideDrawerDefinition('', controlData, _this));
                            }
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.SignatureCaptureFragmentContainer:
                            _this.controls.push(new SignatureCaptureFragmentContainerDefinition_1.SignatureCaptureFragmentContainerDefinition('', controlData, _this));
                            break;
                        case BaseControlDefinition_1.BaseControlDefinition.type.FlexibleColumnLayout:
                            _this.controls.push(new FlexibleColumnLayoutDefinition_1.FlexibleColumnLayoutDefinition('', controlData, _this));
                            break;
                        default:
                            var sMessage = ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_CALL_LOADCONTROLS_AS_INVALID_TYPE, controlData._Type);
                            throw new Error(sMessage);
                    }
                }
                else {
                    var sMessage = ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_CALL_LOADCONTROLS_AS_NOT_SUPPORT, controlData._Type, _this.getName());
                    throw new Error(sMessage);
                }
            });
        }
    };
    return ContainerDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.ContainerDefinition = ContainerDefinition;
;
