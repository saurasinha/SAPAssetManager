"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var BaseCollectionSectionObservable = (function (_super) {
    __extends(BaseCollectionSectionObservable, _super);
    function BaseCollectionSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseCollectionSectionObservable.prototype._bindValues = function (bindingObject, definition) {
        var _this = this;
        return _super.prototype._bindValues.call(this, bindingObject, definition).then(function (sectionParameters) {
            return _this._resolveLayout(sectionParameters);
        });
    };
    BaseCollectionSectionObservable.prototype._resolveLayout = function (sectionParameters) {
        var layoutBindings = [];
        var colLayout = this.section.definition.collectionLayoutDefinition;
        if (colLayout) {
            if (colLayout.layoutType) {
                layoutBindings.push(this._bindValue(this.binding, 'LayoutType', colLayout.layoutType)
                    .then(function (value) {
                    sectionParameters[BaseSectionObservable_1.BaseSectionObservable._layoutType] = value;
                }));
            }
            if (colLayout.minimumInteritemSpacing) {
                layoutBindings.push(this._bindValue(this.binding, 'MinimumInteritemSpacing', colLayout.minimumInteritemSpacing).then(function (value) {
                    sectionParameters[BaseSectionObservable_1.BaseSectionObservable._minimumInteritemSpacing] = value;
                }));
            }
            if (colLayout.numberOfColumns) {
                layoutBindings.push(this._bindValue(this.binding, 'NumberOfColumns', colLayout.numberOfColumns)
                    .then(function (value) {
                    sectionParameters[BaseSectionObservable_1.BaseSectionObservable._numberOfColumns] = value;
                }));
            }
        }
        return Promise.all(layoutBindings).then(function () {
            return sectionParameters;
        });
    };
    return BaseCollectionSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.BaseCollectionSectionObservable = BaseCollectionSectionObservable;
