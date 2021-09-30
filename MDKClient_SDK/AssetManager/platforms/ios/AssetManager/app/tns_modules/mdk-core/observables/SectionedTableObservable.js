"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObservable_1 = require("./BaseObservable");
var ValueResolver_1 = require("../utils/ValueResolver");
var SectionedTableObservable = (function (_super) {
    __extends(SectionedTableObservable, _super);
    function SectionedTableObservable(table, sectionedTableDefinition, oPage) {
        return _super.call(this, table, sectionedTableDefinition, oPage) || this;
    }
    SectionedTableObservable.prototype.onDataChanged = function (action, result) {
        this._control.onDataChanged(action, result);
    };
    SectionedTableObservable.prototype.registerDataListeners = function (oControlDef) {
        var pageContextReadLink = this._control.page().context.readLink;
        var tableContextReadLink = this._control.context.readLink;
        if (tableContextReadLink && tableContextReadLink !== pageContextReadLink) {
            this._dataSubscriptions.push(tableContextReadLink);
        }
        return _super.prototype.registerDataListeners.call(this, oControlDef);
    };
    SectionedTableObservable.prototype.resolveLoadingIndicator = function () {
        var loadingIndicator = this._control.definition().getLoadingIndicator();
        if (loadingIndicator != null) {
            return ValueResolver_1.ValueResolver.resolveValue(loadingIndicator, this.context);
        }
        else {
            return Promise.resolve(null);
        }
    };
    return SectionedTableObservable;
}(BaseObservable_1.BaseObservable));
exports.SectionedTableObservable = SectionedTableObservable;
