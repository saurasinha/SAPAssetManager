"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var NavigationActionBuilder = (function (_super) {
    __extends(NavigationActionBuilder, _super);
    function NavigationActionBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    NavigationActionBuilder.prototype.build = function () {
        var _this = this;
        return _super.prototype.build.call(this).then(function (data) {
            _this.correctTansition(data);
            return data;
        });
    };
    NavigationActionBuilder.prototype.setClearHistory = function (clearHistory) {
        this.data.clearHistory = clearHistory;
        return this;
    };
    NavigationActionBuilder.prototype.setModalPage = function (modalPage) {
        this.data.modalPage = modalPage;
        return this;
    };
    NavigationActionBuilder.prototype.setModalPageFullscreen = function (isFullScreen) {
        this.data.modalPageFullscreen = isFullScreen;
        return this;
    };
    NavigationActionBuilder.prototype.setPageToOpen = function (pageToOpen) {
        this.data.pageToOpen = pageToOpen;
        return this;
    };
    NavigationActionBuilder.prototype.setPageMetadata = function (pageMetadata) {
        this.data.pageMetadata = pageMetadata;
        return this;
    };
    NavigationActionBuilder.prototype.setIsOuterNavigation = function (isOuterNavigation) {
        this.data.isOuterNavigation = isOuterNavigation;
        return this;
    };
    NavigationActionBuilder.prototype.setIsInnerNavigation = function (isInnerNavigation) {
        this.data.isInnerNavigation = isInnerNavigation;
        return this;
    };
    NavigationActionBuilder.prototype.setIsRootNavigation = function (isRootNavigation) {
        this.data.isRootNavigation = isRootNavigation;
        return this;
    };
    NavigationActionBuilder.prototype.setTransition = function (transition) {
        this.data.transition = transition;
        return this;
    };
    NavigationActionBuilder.prototype.setNavigationType = function (type) {
        this.data.navigationType = type;
        return this;
    };
    NavigationActionBuilder.prototype.getValueFromKey = function (map, key) {
        var result;
        if (key && typeof (key) === 'string') {
            for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
                var item = map_1[_i];
                if (item.key === key.toLowerCase()) {
                    return item.value;
                }
            }
        }
        return result;
    };
    NavigationActionBuilder.prototype.correctTansition = function (data) {
        if (data.transition) {
            var transition = data.transition;
            var trans = {
                curve: undefined,
                duration: undefined,
                name: undefined,
                noTrans: false,
            };
            trans.curve = transition.Curve;
            if (!trans.curve) {
                trans.curve = transition.curve;
            }
            trans.curve = this.getValueFromKey(NavigationActionBuilder._curves, trans.curve);
            if (!trans.curve) {
                delete trans.curve;
            }
            if (transition.duration) {
                trans.duration = transition.duration;
            }
            else {
                trans.duration = transition.Duration;
            }
            if (typeof (trans.duration) === 'number') {
                trans.duration = Math.round(trans.duration * 1000);
            }
            else {
                delete trans.duration;
            }
            if (transition.name) {
                trans.name = transition.name;
            }
            else {
                trans.name = transition.Name;
            }
            trans.name = this.getValueFromKey(NavigationActionBuilder._names, trans.name);
            if (!trans.name || typeof (trans.name) !== 'string') {
                trans = undefined;
            }
            else {
                if (trans.name.toLowerCase() === 'none') {
                    trans.noTrans = true;
                }
            }
            data.transition = trans;
        }
        else {
            delete data.transition;
        }
    };
    NavigationActionBuilder._curves = [
        {
            key: 'ease',
            value: 'ease',
        },
        {
            key: 'easein',
            value: 'easeIn',
        },
        {
            key: 'easeinout',
            value: 'easeInOut',
        },
        {
            key: 'easeout',
            value: 'easeOut',
        },
        {
            key: 'linear',
            value: 'linear',
        },
        {
            key: 'spring',
            value: 'spring',
        },
    ];
    NavigationActionBuilder._names = [
        {
            key: 'none',
            value: 'none',
        },
        {
            key: 'curl',
            value: 'curl',
        },
        {
            key: 'curlup',
            value: 'curlUp',
        },
        {
            key: 'curldown',
            value: 'curlDown',
        },
        {
            key: 'explode',
            value: 'explode',
        },
        {
            key: 'fade',
            value: 'fade',
        },
        {
            key: 'flip',
            value: 'flip',
        },
        {
            key: 'flipright',
            value: 'flipRight',
        },
        {
            key: 'flipleft',
            value: 'flipLeft',
        },
        {
            key: 'slide',
            value: 'slide',
        },
        {
            key: 'slideleft',
            value: 'slideLeft',
        },
        {
            key: 'slideright',
            value: 'slideRight',
        },
        {
            key: 'slidetop',
            value: 'slideTop',
        },
        {
            key: 'slidebottom',
            value: 'slideBottom',
        },
    ];
    return NavigationActionBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.NavigationActionBuilder = NavigationActionBuilder;
