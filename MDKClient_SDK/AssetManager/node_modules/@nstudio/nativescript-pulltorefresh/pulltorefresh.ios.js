"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("tns-core-modules/utils/utils");
var common = require("./pulltorefresh-common");
__export(require("./pulltorefresh-common"));
var PullToRefreshHandler = (function (_super) {
    __extends(PullToRefreshHandler, _super);
    function PullToRefreshHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PullToRefreshHandler.initWithOnwer = function (owner) {
        var impl = PullToRefreshHandler.new();
        impl._owner = owner;
        return impl;
    };
    PullToRefreshHandler.prototype.handleRefresh = function (refreshControl) {
        var pullToRefresh = this._owner.get();
        pullToRefresh.refreshing = true;
        pullToRefresh.notify({
            eventName: common.PullToRefreshBase.refreshEvent,
            object: pullToRefresh
        });
    };
    PullToRefreshHandler.ObjCExposedMethods = {
        handleRefresh: { returns: interop.types.void, params: [UIRefreshControl] }
    };
    return PullToRefreshHandler;
}(NSObject));
var SUPPORT_REFRESH_CONTROL = utils_1.ios.MajorVersion >= 10;
var PullToRefresh = (function (_super) {
    __extends(PullToRefresh, _super);
    function PullToRefresh() {
        var _this = _super.call(this) || this;
        _this.refreshControl = UIRefreshControl.alloc().init();
        _this._handler = PullToRefreshHandler.initWithOnwer(new WeakRef(_this));
        _this.refreshControl.addTargetActionForControlEvents(_this._handler, 'handleRefresh', 4096);
        return _this;
    }
    PullToRefresh.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.content.ios instanceof UIScrollView) {
            if (SUPPORT_REFRESH_CONTROL) {
                this.content.ios.refreshControl = this.refreshControl;
            }
            else {
                this.content.ios.alwaysBounceVertical = true;
                this.content.ios.addSubview(this.refreshControl);
            }
        }
        else if (this.content.ios instanceof WKWebView) {
            if (SUPPORT_REFRESH_CONTROL) {
                this.content.ios.scrollView.refreshControl = this.refreshControl;
            }
            else {
                this.content.ios.scrollView.alwaysBounceVertical = true;
                this.content.ios.scrollView.addSubview(this.refreshControl);
            }
        }
        else if (typeof TKListView !== 'undefined' &&
            this.content.ios instanceof TKListView) {
            if (SUPPORT_REFRESH_CONTROL) {
                this.content.ios.collectionView.refreshControl = this.refreshControl;
            }
            else {
                this.content.ios.collectionView.alwaysBounceVertical = true;
                this.content.ios.collectionView.addSubview(this.refreshControl);
            }
        }
        else if (this.content.ios instanceof WKWebView) {
            if (SUPPORT_REFRESH_CONTROL) {
                this.content.ios.scrollView.refreshControl = this.refreshControl;
            }
            else {
                this.content.ios.scrollView.alwaysBounceVertical = true;
                this.content.ios.scrollView.addSubview(this.refreshControl);
            }
        }
        else {
            throw new Error('Content must inherit from either UIScrollView or WKWebView!');
        }
    };
    PullToRefresh.prototype[common.refreshingProperty.getDefault] = function () {
        return false;
    };
    PullToRefresh.prototype[common.refreshingProperty.setNative] = function (value) {
        if (value) {
            this.refreshControl.beginRefreshing();
        }
        else {
            this.refreshControl.endRefreshing();
        }
    };
    PullToRefresh.prototype[common.indicatorColorProperty.getDefault] = function () {
        return this.refreshControl.tintColor;
    };
    PullToRefresh.prototype[common.indicatorColorProperty.setNative] = function (value) {
        var color = value ? value.ios : this.color;
        this.refreshControl.tintColor = color;
    };
    PullToRefresh.prototype[common.indicatorColorStyleProperty.getDefault] = function () {
        return this.refreshControl.tintColor;
    };
    PullToRefresh.prototype[common.indicatorColorStyleProperty.setNative] = function (value) {
        if (this.indicatorColor) {
            return;
        }
        var color = value ? value.ios : this.color;
        this.refreshControl.tintColor = color;
    };
    PullToRefresh.prototype[common.indicatorFillColorProperty.getDefault] = function () {
        return this.refreshControl.backgroundColor;
    };
    PullToRefresh.prototype[common.indicatorFillColorProperty.setNative] = function (value) {
        var color = value ? value.ios : this.backgroundColor;
        this.refreshControl.backgroundColor = color;
    };
    PullToRefresh.prototype[common.indicatorFillColorStyleProperty.getDefault] = function () {
        return this.refreshControl.backgroundColor;
    };
    PullToRefresh.prototype[common.indicatorFillColorStyleProperty.setNative] = function (value) {
        if (this.indicatorFillColor) {
            return;
        }
        var color = value ? value.ios : this.backgroundColor;
        this.refreshControl.backgroundColor = color;
    };
    return PullToRefresh;
}(common.PullToRefreshBase));
exports.PullToRefresh = PullToRefresh;
//# sourceMappingURL=pulltorefresh.ios.js.map