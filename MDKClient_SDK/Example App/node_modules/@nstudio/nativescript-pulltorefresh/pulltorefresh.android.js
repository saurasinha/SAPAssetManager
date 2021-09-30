"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./pulltorefresh-common");
__export(require("./pulltorefresh-common"));
var SwipeRefreshLayout_Namespace = useAndroidX()
    ? androidx.swiperefreshlayout.widget
    : android.support.v4.widget;
function useAndroidX() {
    return global.androidx && androidx.swiperefreshlayout;
}
var CarouselFriendlySwipeRefreshLayout = (function (_super) {
    __extends(CarouselFriendlySwipeRefreshLayout, _super);
    function CarouselFriendlySwipeRefreshLayout(context, attrs) {
        var _this = _super.call(this, context, attrs) || this;
        _this._touchSlop = android.view.ViewConfiguration.get(context).getScaledTouchSlop();
        return _this;
    }
    CarouselFriendlySwipeRefreshLayout.prototype.onInterceptTouchEvent = function (event) {
        switch (event.getAction()) {
            case android.view.MotionEvent.ACTION_DOWN: {
                this._previousX = android.view.MotionEvent.obtain(event).getX();
                break;
            }
            case android.view.MotionEvent.ACTION_MOVE: {
                var eventX = event.getX();
                var xDifference = Math.abs(eventX - this._previousX);
                if (xDifference > this._touchSlop) {
                    return false;
                }
                break;
            }
        }
        return _super.prototype.onInterceptTouchEvent.call(this, event);
    };
    return CarouselFriendlySwipeRefreshLayout;
}(SwipeRefreshLayout_Namespace.SwipeRefreshLayout));
var PullToRefresh = (function (_super) {
    __extends(PullToRefresh, _super);
    function PullToRefresh() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PullToRefresh.prototype, "android", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    PullToRefresh.prototype.createNativeView = function () {
        var swipeRefreshLayout = new CarouselFriendlySwipeRefreshLayout(this._context);
        if (!this._androidViewId) {
            this._androidViewId = android.view.View.generateViewId();
        }
        swipeRefreshLayout.setId(this._androidViewId);
        if (useAndroidX()) {
            var androidXListener = new androidx.swiperefreshlayout.widget.SwipeRefreshLayout.OnRefreshListener({
                onRefresh: function () {
                    var owner = this.owner.get();
                    if (owner) {
                        owner.refreshing = true;
                        owner.notify({
                            eventName: common.PullToRefreshBase.refreshEvent,
                            object: owner
                        });
                    }
                }
            });
            swipeRefreshLayout.setOnRefreshListener(androidXListener);
            swipeRefreshLayout.refreshListener = androidXListener;
        }
        else {
            var supportListener = new android.support
                .v4.widget.SwipeRefreshLayout.OnRefreshListener({
                onRefresh: function (v) {
                    var owner = this.owner.get();
                    if (owner) {
                        owner.refreshing = true;
                        owner.notify({
                            eventName: common.PullToRefreshBase.refreshEvent,
                            object: owner
                        });
                    }
                }
            });
            swipeRefreshLayout.setOnRefreshListener(supportListener);
            swipeRefreshLayout.refreshListener = supportListener;
        }
        return swipeRefreshLayout;
    };
    PullToRefresh.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeView;
        nativeView.refreshListener.owner = new WeakRef(this);
    };
    PullToRefresh.prototype.disposeNativeView = function () {
        var nativeView = this.nativeView;
        nativeView.refreshListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    PullToRefresh.prototype[common.refreshingProperty.getDefault] = function () {
        return false;
    };
    PullToRefresh.prototype[common.refreshingProperty.setNative] = function (value) {
        this.nativeView.setRefreshing(value);
    };
    PullToRefresh.prototype[common.indicatorColorProperty.setNative] = function (value) {
        var color = value ? value.android : this.color;
        this.nativeView.setColorSchemeColors([color]);
    };
    PullToRefresh.prototype[common.indicatorColorStyleProperty.setNative] = function (value) {
        if (this.indicatorColor) {
            return;
        }
        var color = value ? value.android : this.color;
        this.nativeView.setColorSchemeColors([color]);
    };
    PullToRefresh.prototype[common.indicatorFillColorProperty.setNative] = function (value) {
        var color = value ? value.android : this.backgroundColor;
        this.nativeView.setProgressBackgroundColorSchemeColor(color);
    };
    PullToRefresh.prototype[common.indicatorFillColorStyleProperty.setNative] = function (value) {
        if (this.indicatorFillColor) {
            return;
        }
        var color = value ? value.android : this.backgroundColor;
        this.nativeView.setProgressBackgroundColorSchemeColor(color);
    };
    return PullToRefresh;
}(common.PullToRefreshBase));
exports.PullToRefresh = PullToRefresh;
//# sourceMappingURL=pulltorefresh.android.js.map