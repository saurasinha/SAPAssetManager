"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color");
var content_view_1 = require("tns-core-modules/ui/content-view");
var properties_1 = require("tns-core-modules/ui/core/properties");
var style_1 = require("tns-core-modules/ui/styling/style");
__export(require("tns-core-modules/ui/content-view"));
var PullToRefreshBase = (function (_super) {
    __extends(PullToRefreshBase, _super);
    function PullToRefreshBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PullToRefreshBase.refreshEvent = 'refresh';
    return PullToRefreshBase;
}(content_view_1.ContentView));
exports.PullToRefreshBase = PullToRefreshBase;
exports.refreshingProperty = new properties_1.Property({
    name: 'refreshing',
    defaultValue: false
});
exports.refreshingProperty.register(PullToRefreshBase);
exports.indicatorColorProperty = new properties_1.Property({
    name: 'indicatorColor',
    affectsLayout: true,
    valueConverter: function (v) {
        if (!color_1.Color.isValid(v)) {
            return null;
        }
        return new color_1.Color(v);
    }
});
exports.indicatorColorProperty.register(PullToRefreshBase);
exports.indicatorColorStyleProperty = new properties_1.CssProperty({
    name: 'indicatorColorStyle',
    cssName: 'indicator-color',
    affectsLayout: true,
    valueConverter: function (v) {
        if (!color_1.Color.isValid(v)) {
            return null;
        }
        return new color_1.Color(v);
    }
});
exports.indicatorColorStyleProperty.register(style_1.Style);
exports.indicatorFillColorProperty = new properties_1.Property({
    name: 'indicatorFillColor',
    affectsLayout: true,
    valueConverter: function (v) {
        if (!color_1.Color.isValid(v)) {
            return null;
        }
        return new color_1.Color(v);
    }
});
exports.indicatorFillColorProperty.register(PullToRefreshBase);
exports.indicatorFillColorStyleProperty = new properties_1.CssProperty({
    name: 'indicatorFillColorStyle',
    cssName: 'indicator-fill-color',
    affectsLayout: true,
    valueConverter: function (v) {
        if (!color_1.Color.isValid(v)) {
            return null;
        }
        return new color_1.Color(v);
    }
});
exports.indicatorFillColorStyleProperty.register(style_1.Style);
//# sourceMappingURL=pulltorefresh-common.js.map