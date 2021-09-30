"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var NavigationActionDefinition = (function (_super) {
    __extends(NavigationActionDefinition, _super);
    function NavigationActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    NavigationActionDefinition.prototype.getPageToOpen = function () {
        return this.data.PageToOpen;
    };
    NavigationActionDefinition.prototype.getPageMetadata = function () {
        return this.data.PageMetadata;
    };
    NavigationActionDefinition.prototype.getTransition = function () {
        return this.data.Transition;
    };
    Object.defineProperty(NavigationActionDefinition.prototype, "isModalNavigation", {
        get: function () {
            return this.data.ModalPage ? this.data.ModalPage : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationActionDefinition.prototype, "isOuterNavigation", {
        get: function () {
            return this.data.OuterNavigation ? this.data.OuterNavigation : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationActionDefinition.prototype, "isInnerNavigation", {
        get: function () {
            return this.data.InnerNavigation ? this.data.InnerNavigation : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationActionDefinition.prototype, "isRootNavigation", {
        get: function () {
            return this.data.RootNavigation ? this.data.RootNavigation : false;
        },
        enumerable: true,
        configurable: true
    });
    NavigationActionDefinition.prototype.isModalPage = function () {
        return this.isModalNavigation;
    };
    Object.defineProperty(NavigationActionDefinition.prototype, "isFullScreenModal", {
        get: function () {
            return this.data.ModalPageFullscreen ? this.data.ModalPageFullscreen : false;
        },
        enumerable: true,
        configurable: true
    });
    NavigationActionDefinition.prototype.isModalPageFullscreen = function () {
        return this.isFullScreenModal;
    };
    Object.defineProperty(NavigationActionDefinition.prototype, "isClearHistory", {
        get: function () {
            return this.data.ClearHistory ? this.data.ClearHistory : false;
        },
        enumerable: true,
        configurable: true
    });
    NavigationActionDefinition.prototype.getNavigationType = function () {
        return this.data.NavigationType;
    };
    return NavigationActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.NavigationActionDefinition = NavigationActionDefinition;
;
