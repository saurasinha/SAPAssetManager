"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var ClientSettings_1 = require("../../storage/ClientSettings");
var FormCellSectionObservable = (function (_super) {
    __extends(FormCellSectionObservable, _super);
    function FormCellSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.FORMCELLS_ITEMCOUNT_PARAM_KEY = 'itemCount';
        _this.FORMCELLS_LOCALE_PARAM_KEY = 'locale';
        return _this;
    }
    FormCellSectionObservable.prototype.bind = function () {
        var _this = this;
        this._staticCells = true;
        return _super.prototype.bind.call(this).then(function () {
            _this._sectionParameters[_this.FORMCELLS_ITEMCOUNT_PARAM_KEY] = _this.section.controls.length;
            _this._sectionParameters[_this.FORMCELLS_LOCALE_PARAM_KEY] = ClientSettings_1.ClientSettings.getAppLocale();
            return _this._sectionParameters;
        });
    };
    return FormCellSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.FormCellSectionObservable = FormCellSectionObservable;
