"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObservable_1 = require("./BaseObservable");
var ValueResolver_1 = require("../utils/ValueResolver");
var DataEventHandler_1 = require("../data/DataEventHandler");
var SideDrawerObservable = (function (_super) {
    __extends(SideDrawerObservable, _super);
    function SideDrawerObservable(sideDrawer, sideDrawerDefinition, oPage) {
        return _super.call(this, sideDrawer, sideDrawerDefinition, oPage) || this;
    }
    SideDrawerObservable.prototype.onDataChanged = function (action, result) {
        if (this._control.isVisible) {
            this.redraw();
        }
        else {
            this._control.staleDataChanged = true;
        }
    };
    SideDrawerObservable.prototype.registerDataListeners = function (oControlDef) {
        var _this = this;
        var sideDrawerContextReadLink = this._control.context.readLink;
        if (sideDrawerContextReadLink) {
            this._dataSubscriptions.push(sideDrawerContextReadLink);
        }
        return _super.prototype.registerDataListeners.call(this, oControlDef)
            .then(function () {
            if (oControlDef.header && oControlDef.header.target && oControlDef.header.target.Service) {
                _this._dataSubscriptions.push(oControlDef.header.target.Service);
                if (oControlDef.header.target.EntitySet) {
                    ValueResolver_1.ValueResolver.resolveValue(oControlDef.header.target.EntitySet, _this.context)
                        .then(function (result) {
                        _this._dataSubscriptions.push(result);
                        DataEventHandler_1.DataEventHandler.getInstance().subscribe(result, _this);
                    });
                }
            }
        });
    };
    return SideDrawerObservable;
}(BaseObservable_1.BaseObservable));
exports.SideDrawerObservable = SideDrawerObservable;
