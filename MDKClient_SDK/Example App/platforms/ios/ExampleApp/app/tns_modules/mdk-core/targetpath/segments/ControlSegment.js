"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var BaseControlDefinition_1 = require("../../definitions/controls/BaseControlDefinition");
var BaseSectionDefinition_1 = require("../../definitions/sections/BaseSectionDefinition");
var IMDKPage_1 = require("../../pages/IMDKPage");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var app = require("tns-core-modules/application");
var ControlSegment = (function (_super) {
    __extends(ControlSegment, _super);
    function ControlSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControlSegment.prototype.resolve = function () {
        var control = this.findControlByName(this.specifier);
        if (!control) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.FAILED_FIND_CONTROL_IN_VIEW, this.specifier));
        }
        return control.context;
    };
    ControlSegment.prototype.findControlByName = function (controlName) {
        if (!IMDKPage_1.isMDKPage(this.context.element)) {
            throw new Error(ErrorMessage_1.ErrorMessage.FAILED_FIND_PAGE);
        }
        var page = this.context.element;
        if (app.android && page.definition.getName() === 'ListPickerFragment') {
            page = this.context.element.previousPage;
        }
        var childControls = page.controls;
        return this.findControlInChildControls(childControls, controlName);
    };
    ControlSegment.prototype.findControlInChildControls = function (childControls, controlName) {
        var _loop_1 = function (control) {
            if (control.definition().getName() === controlName) {
                return { value: control };
            }
            else if (control.definition().getType() === BaseControlDefinition_1.BaseControlDefinition.type.FormCellContainer) {
                var formcellControl = this_1.findControlInChildControls(control.controls, controlName);
                if (formcellControl) {
                    return { value: formcellControl };
                }
            }
            else if (control.definition().getType() === BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable) {
                var controls_1 = [];
                control.sections.forEach(function (section) {
                    if (section.definition.type === BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection) {
                        section.controls.forEach(function (control) {
                            controls_1.push(control);
                        });
                    }
                });
                var formcellControl = this_1.findControlInChildControls(controls_1, controlName);
                if (formcellControl) {
                    return { value: formcellControl };
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, childControls_1 = childControls; _i < childControls_1.length; _i++) {
            var control = childControls_1[_i];
            var state_1 = _loop_1(control);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    return ControlSegment;
}(ISegment_1.ISegment));
exports.ControlSegment = ControlSegment;
