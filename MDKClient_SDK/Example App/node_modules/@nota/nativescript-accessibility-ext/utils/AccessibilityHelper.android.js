"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nsApp = require("@nativescript/core/application");
var profiling_1 = require("@nativescript/core/profiling");
var trace = require("@nativescript/core/trace");
var view_1 = require("@nativescript/core/ui/core/view");
var gestures_1 = require("@nativescript/core/ui/gestures/gestures");
var list_view_1 = require("@nativescript/core/ui/list-view/list-view");
var proxy_view_container_1 = require("@nativescript/core/ui/proxy-view-container");
var utils = require("@nativescript/core/utils/utils");
var trace_1 = require("../trace");
var view_common_1 = require("../ui/core/view-common");
var helpers_1 = require("./helpers");
var utils_1 = require("./utils");
function writeHelperTrace(message, type) {
    if (type === void 0) { type = trace.messageType.info; }
    trace_1.writeTrace(message, type, trace_1.categories.AndroidHelper);
}
exports.getAndroidView = profiling_1.profile('getAndroidView', function getAndroidViewImpl(tnsView) {
    return tnsView.nativeView || tnsView.nativeViewProtected;
});
function getUIView(tnsView) {
    throw new Error("getUIView(" + tnsView + ") - should never be called on Android");
}
exports.getUIView = getUIView;
var AccessibilityEvent = android.view.accessibility.AccessibilityEvent;
var AccessibilityManager = android.view.accessibility.AccessibilityManager;
var AccessibilityDelegate = android.view.View.androidviewViewAccessibilityDelegate;
AccessibilityDelegate = android.view.View.AccessibilityDelegate;
var AccessibilityNodeInfo = android.view.accessibility.AccessibilityNodeInfo;
var AndroidView = android.view.View;
var AndroidViewGroup = android.view.ViewGroup;
var clickableRolesMap = new Set();
var getAccessibilityManager = profiling_1.profile('getAccessibilityManager', function getAccessibilityManagerImpl(view) {
    return view.getContext().getSystemService(android.content.Context.ACCESSIBILITY_SERVICE);
});
var suspendAccessibilityEvents = false;
var a11yScrollOnFocus = 'a11y-scroll-on-focus';
var lastFocusedView;
var accessibilityEventHelper = profiling_1.profile('accessibilityEventHelper', function accessibilityEventHelperImpl(tnsView, eventType) {
    var e_1, _a;
    var eventName = accessibilityEventTypeMap.get(eventType);
    if (!utils_1.isAccessibilityServiceEnabled()) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("accessibilityEventHelper: Service not active");
        }
        return;
    }
    if (!eventName) {
        writeHelperTrace("accessibilityEventHelper: unknown eventType: " + eventType, trace.messageType.error);
        return;
    }
    if (!tnsView) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("accessibilityEventHelper: no owner: " + eventName);
        }
        return;
    }
    var androidView = exports.getAndroidView(tnsView);
    if (!androidView) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("accessibilityEventHelper: no nativeView");
        }
        return;
    }
    switch (eventType) {
        case AccessibilityEvent.TYPE_VIEW_CLICKED: {
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                try {
                    for (var _b = __values(tnsView.getGestureObservers(gestures_1.GestureTypes.tap) || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var tapGesture = _c.value;
                        tapGesture.callback({
                            android: tnsView.android,
                            eventName: 'tap',
                            ios: null,
                            object: tnsView,
                            type: gestures_1.GestureTypes.tap,
                            view: tnsView,
                        });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return;
        }
        case AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED: {
            var lastView = lastFocusedView && lastFocusedView.get();
            if (lastView && tnsView !== lastView) {
                var lastAndroidView = exports.getAndroidView(lastView);
                if (lastAndroidView) {
                    lastAndroidView.clearFocus();
                    lastFocusedView = null;
                    helpers_1.notifyAccessibilityFocusState(lastView, false, true);
                }
            }
            lastFocusedView = new WeakRef(tnsView);
            helpers_1.notifyAccessibilityFocusState(tnsView, true, false);
            var tree = [];
            for (var node = tnsView; node; node = node.parent) {
                node.notify({
                    eventName: a11yScrollOnFocus,
                    object: tnsView,
                });
                tree.push(node + "[" + (node.className || '') + "]");
            }
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace("Focus-tree: " + tree.reverse().join(' => '));
            }
            return;
        }
        case AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUS_CLEARED: {
            var lastView = lastFocusedView && lastFocusedView.get();
            if (lastView && tnsView === lastView) {
                lastFocusedView = null;
                androidView.clearFocus();
            }
            helpers_1.notifyAccessibilityFocusState(tnsView, false, true);
            return;
        }
    }
});
var TNSAccessibilityDelegate;
var androidViewToTNSView = new WeakMap();
var accessibilityEventMap;
var accessibilityEventTypeMap;
function ensureNativeClasses() {
    if (TNSAccessibilityDelegate) {
        return;
    }
    var RoleTypeMap = new Map([
        [view_common_1.AccessibilityRole.Button, android.widget.Button.class.getName()],
        [view_common_1.AccessibilityRole.Search, android.widget.EditText.class.getName()],
        [view_common_1.AccessibilityRole.Image, android.widget.ImageView.class.getName()],
        [view_common_1.AccessibilityRole.ImageButton, android.widget.ImageButton.class.getName()],
        [view_common_1.AccessibilityRole.KeyboardKey, android.inputmethodservice.Keyboard.Key.class.getName()],
        [view_common_1.AccessibilityRole.StaticText, android.widget.TextView.class.getName()],
        [view_common_1.AccessibilityRole.Adjustable, android.widget.SeekBar.class.getName()],
        [view_common_1.AccessibilityRole.Checkbox, android.widget.CheckBox.class.getName()],
        [view_common_1.AccessibilityRole.RadioButton, android.widget.RadioButton.class.getName()],
        [view_common_1.AccessibilityRole.SpinButton, android.widget.Spinner.class.getName()],
        [view_common_1.AccessibilityRole.Switch, android.widget.Switch.class.getName()],
        [view_common_1.AccessibilityRole.ProgressBar, android.widget.ProgressBar.class.getName()],
    ]);
    clickableRolesMap = new Set([view_common_1.AccessibilityRole.Button, view_common_1.AccessibilityRole.ImageButton]);
    var ignoreRoleTypesForTrace = new Set([view_common_1.AccessibilityRole.Header, view_common_1.AccessibilityRole.Link, view_common_1.AccessibilityRole.None, view_common_1.AccessibilityRole.Summary]);
    var TNSAccessibilityDelegateImpl = (function (_super) {
        __extends(TNSAccessibilityDelegateImpl, _super);
        function TNSAccessibilityDelegateImpl() {
            var _this = _super.call(this) || this;
            return global.__native(_this);
        }
        TNSAccessibilityDelegateImpl.prototype.getTnsView = function (view) {
            if (!androidViewToTNSView.has(view)) {
                return null;
            }
            var tnsView = androidViewToTNSView.get(view).get();
            if (!tnsView) {
                androidViewToTNSView.delete(view);
                return null;
            }
            return tnsView;
        };
        TNSAccessibilityDelegateImpl.prototype.onInitializeAccessibilityNodeInfo = function (host, info) {
            _super.prototype.onInitializeAccessibilityNodeInfo.call(this, host, info);
            var tnsView = this.getTnsView(host);
            if (!tnsView) {
                if (trace_1.isTraceEnabled()) {
                    writeHelperTrace("onInitializeAccessibilityNodeInfo " + host + " " + info + " no tns-view");
                }
                return;
            }
            var accessibilityRole = tnsView.accessibilityRole;
            if (accessibilityRole) {
                var androidClassName = RoleTypeMap.get(accessibilityRole);
                if (androidClassName) {
                    var oldClassName = info.getClassName() || (android.os.Build.VERSION.SDK_INT >= 28 && host.getAccessibilityClassName()) || null;
                    info.setClassName(androidClassName);
                    if (trace_1.isTraceEnabled()) {
                        writeHelperTrace(tnsView + ".accessibilityRole = \"" + accessibilityRole + "\" is mapped to \"" + androidClassName + "\" (was " + oldClassName + "). " + info.getClassName());
                    }
                }
                else if (!ignoreRoleTypesForTrace.has(accessibilityRole)) {
                    if (trace_1.isTraceEnabled()) {
                        writeHelperTrace(tnsView + ".accessibilityRole = \"" + accessibilityRole + "\" is unknown");
                    }
                }
                if (clickableRolesMap.has(accessibilityRole)) {
                    if (trace_1.isTraceEnabled()) {
                        writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set clickable role=" + accessibilityRole);
                    }
                    info.setClickable(true);
                }
                if (android.os.Build.VERSION.SDK_INT >= 28) {
                    if (accessibilityRole === view_common_1.AccessibilityRole.Header) {
                        if (trace_1.isTraceEnabled()) {
                            writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set heading role=" + accessibilityRole);
                        }
                        info.setHeading(true);
                    }
                    else if (host.isAccessibilityHeading()) {
                        if (trace_1.isTraceEnabled()) {
                            writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set heading from host");
                        }
                        info.setHeading(true);
                    }
                    else {
                        if (trace_1.isTraceEnabled()) {
                            writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set not heading");
                        }
                        info.setHeading(false);
                    }
                }
                switch (accessibilityRole) {
                    case view_common_1.AccessibilityRole.Switch:
                    case view_common_1.AccessibilityRole.RadioButton:
                    case view_common_1.AccessibilityRole.Checkbox: {
                        if (trace_1.isTraceEnabled()) {
                            writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set checkable and check=" + (tnsView.accessibilityState === view_common_1.AccessibilityState.Checked));
                        }
                        info.setCheckable(true);
                        info.setChecked(tnsView.accessibilityState === view_common_1.AccessibilityState.Checked);
                        break;
                    }
                    default: {
                        if (trace_1.isTraceEnabled()) {
                            writeHelperTrace("onInitializeAccessibilityNodeInfo " + tnsView + " - set enabled=" + (tnsView.accessibilityState !==
                                view_common_1.AccessibilityState.Disabled) + " and selected=" + (tnsView.accessibilityState === view_common_1.AccessibilityState.Selected));
                        }
                        info.setEnabled(tnsView.accessibilityState !== view_common_1.AccessibilityState.Disabled);
                        info.setSelected(tnsView.accessibilityState === view_common_1.AccessibilityState.Selected);
                        break;
                    }
                }
            }
            if (tnsView.accessible === true) {
                info.setFocusable(true);
            }
        };
        TNSAccessibilityDelegateImpl.prototype.onInitializeAccessibilityEvent = function (view, event) {
            _super.prototype.onInitializeAccessibilityEvent.call(this, view, event);
        };
        TNSAccessibilityDelegateImpl.prototype.onPopulateAccessibilityEvent = function (view, event) {
            _super.prototype.onPopulateAccessibilityEvent.call(this, view, event);
        };
        TNSAccessibilityDelegateImpl.prototype.dispatchPopulateAccessibilityEvent = function (view, event) {
            return _super.prototype.dispatchPopulateAccessibilityEvent.call(this, view, event);
        };
        TNSAccessibilityDelegateImpl.prototype.sendAccessibilityEvent = function (host, eventType) {
            _super.prototype.sendAccessibilityEvent.call(this, host, eventType);
            var tnsView = this.getTnsView(host);
            if (!tnsView) {
                console.log("skip - " + host + " - " + accessibilityEventTypeMap.get(eventType));
                return;
            }
            if (suspendAccessibilityEvents) {
                if (trace_1.isTraceEnabled()) {
                    writeHelperTrace("sendAccessibilityEvent: " + tnsView + " - skip");
                }
                return;
            }
            try {
                accessibilityEventHelper(tnsView, eventType);
            }
            catch (err) {
                console.error(err);
            }
        };
        TNSAccessibilityDelegateImpl.prototype.onRequestSendAccessibilityEvent = function (host, view, event) {
            if (suspendAccessibilityEvents) {
                return false;
            }
            return _super.prototype.onRequestSendAccessibilityEvent.call(this, host, view, event);
        };
        return TNSAccessibilityDelegateImpl;
    }(AccessibilityDelegate));
    TNSAccessibilityDelegate = new TNSAccessibilityDelegateImpl();
    accessibilityEventMap = new Map([
        ['invalid_position', AccessibilityEvent.INVALID_POSITION],
        ['max_text_length', AccessibilityEvent.MAX_TEXT_LENGTH],
        ['view_clicked', AccessibilityEvent.TYPE_VIEW_CLICKED],
        ['view_long_clicked', AccessibilityEvent.TYPE_VIEW_LONG_CLICKED],
        ['view_selected', AccessibilityEvent.TYPE_VIEW_SELECTED],
        ['view_focused', AccessibilityEvent.TYPE_VIEW_FOCUSED],
        ['view_text_changed', AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED],
        ['window_state_changed', AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED],
        ['notification_state_changed', AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED],
        ['view_hover_enter', AccessibilityEvent.TYPE_VIEW_HOVER_ENTER],
        ['view_hover_exit', AccessibilityEvent.TYPE_VIEW_HOVER_EXIT],
        ['touch_exploration_gesture_start', AccessibilityEvent.TYPE_TOUCH_EXPLORATION_GESTURE_START],
        ['touch_exploration_gesture_end', AccessibilityEvent.TYPE_TOUCH_EXPLORATION_GESTURE_END],
        ['window_content_changed', AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED],
        ['view_scrolled', AccessibilityEvent.TYPE_VIEW_SCROLLED],
        ['view_text_selection_changed', AccessibilityEvent.TYPE_VIEW_TEXT_SELECTION_CHANGED],
        ['announcement', AccessibilityEvent.TYPE_ANNOUNCEMENT],
        ['view_accessibility_focused', AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED],
        ['view_accessibility_focus_cleared', AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUS_CLEARED],
        ['view_text_traversed_at_movement_granularity', AccessibilityEvent.TYPE_VIEW_TEXT_TRAVERSED_AT_MOVEMENT_GRANULARITY],
        ['gesture_detection_start', AccessibilityEvent.TYPE_GESTURE_DETECTION_START],
        ['gesture_detection_end', AccessibilityEvent.TYPE_GESTURE_DETECTION_END],
        ['touch_interaction_start', AccessibilityEvent.TYPE_TOUCH_INTERACTION_START],
        ['touch_interaction_end', AccessibilityEvent.TYPE_TOUCH_INTERACTION_END],
        ['all', AccessibilityEvent.TYPES_ALL_MASK],
    ]);
    accessibilityEventTypeMap = new Map(__spread(accessibilityEventMap).map(function (_a) {
        var _b = __read(_a, 2), k = _b[0], v = _b[1];
        return [v, k];
    }));
}
var AccessibilityHelper = (function () {
    function AccessibilityHelper() {
    }
    AccessibilityHelper.updateAccessibilityProperties = function (tnsView) {
        if (tnsView instanceof proxy_view_container_1.ProxyViewContainer) {
            return null;
        }
        setAccessibilityDelegate(tnsView);
        applyContentDescription(tnsView);
    };
    AccessibilityHelper.sendAccessibilityEvent = function (tnsView, eventName, text) {
        var cls = "AccessibilityHelper.sendAccessibilityEvent(" + tnsView + ", " + eventName + ", " + text + ")";
        var androidView = exports.getAndroidView(tnsView);
        if (!androidView) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + ": no nativeView");
            }
            return;
        }
        if (!eventName) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + ": no eventName provided");
            }
            return;
        }
        if (!utils_1.isAccessibilityServiceEnabled()) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - TalkBack not enabled");
            }
            return;
        }
        var a11yService = getAccessibilityManager(androidView);
        if (!a11yService.isEnabled()) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - a11yService not enabled");
            }
            return;
        }
        eventName = eventName.toLowerCase();
        if (!accessibilityEventMap.has(eventName)) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - unknown event");
            }
            return;
        }
        var eventInt = accessibilityEventMap.get(eventName);
        if (!text) {
            return androidView.sendAccessibilityEvent(eventInt);
        }
        var a11yEvent = AccessibilityEvent.obtain(eventInt);
        a11yEvent.setSource(androidView);
        a11yEvent.getText().clear();
        if (!text) {
            applyContentDescription(tnsView);
            text = androidView.getContentDescription() || tnsView['title'];
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - text not provided use androidView.getContentDescription() - " + text);
            }
        }
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + ": send event with text: '" + JSON.stringify(text) + "'");
        }
        if (text) {
            a11yEvent.getText().add(text);
        }
        a11yService.sendAccessibilityEvent(a11yEvent);
    };
    AccessibilityHelper.updateContentDescription = function (tnsView, forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (tnsView instanceof proxy_view_container_1.ProxyViewContainer) {
            return null;
        }
        return applyContentDescription(tnsView, forceUpdate);
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [view_1.View]),
        __metadata("design:returntype", void 0)
    ], AccessibilityHelper, "updateAccessibilityProperties", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [view_1.View, String, String]),
        __metadata("design:returntype", void 0)
    ], AccessibilityHelper, "sendAccessibilityEvent", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [view_1.View, Object]),
        __metadata("design:returntype", void 0)
    ], AccessibilityHelper, "updateContentDescription", null);
    return AccessibilityHelper;
}());
exports.AccessibilityHelper = AccessibilityHelper;
var removeAccessibilityDelegate = profiling_1.profile('removeAccessibilityDelegate', function removeAccessibilityDelegateImpl(tnsView) {
    if (tnsView instanceof proxy_view_container_1.ProxyViewContainer) {
        return null;
    }
    var androidView = exports.getAndroidView(tnsView);
    if (!androidView) {
        return;
    }
    androidViewToTNSView.delete(androidView);
    androidView.setAccessibilityDelegate(null);
});
var setAccessibilityDelegate = profiling_1.profile('setAccessibilityDelegate', function setAccessibilityDelegateImpl(tnsView) {
    if (tnsView instanceof proxy_view_container_1.ProxyViewContainer) {
        return null;
    }
    ensureNativeClasses();
    var androidView = exports.getAndroidView(tnsView);
    if (!androidView) {
        return;
    }
    androidViewToTNSView.set(androidView, new WeakRef(tnsView));
    var hasOldDelegate = androidView.getAccessibilityDelegate() === TNSAccessibilityDelegate;
    var cls = "AccessibilityHelper.updateAccessibilityProperties(" + tnsView + ") - has delegate? " + hasOldDelegate;
    if (trace_1.isTraceEnabled()) {
        writeHelperTrace(cls);
    }
    if (hasOldDelegate) {
        return;
    }
    androidView.setAccessibilityDelegate(TNSAccessibilityDelegate);
});
var applyContentDescription = profiling_1.profile('applyContentDescription', function applyContentDescriptionImpl(tnsView, forceUpdate) {
    if (tnsView instanceof proxy_view_container_1.ProxyViewContainer) {
        return null;
    }
    var androidView = exports.getAndroidView(tnsView);
    if (androidView instanceof androidx.appcompat.widget.Toolbar) {
        var numChildren = androidView.getChildCount();
        for (var i = 0; i < numChildren; i += 1) {
            var childAndroidView = androidView.getChildAt(i);
            if (childAndroidView instanceof androidx.appcompat.widget.AppCompatTextView) {
                androidView = childAndroidView;
                break;
            }
        }
    }
    var cls = "applyContentDescription(" + tnsView + ")";
    if (!androidView) {
        return null;
    }
    var titleValue = (tnsView['title'] || '').toString().trim();
    var textValue = (tnsView['text'] || '').toString().trim();
    if (!forceUpdate && tnsView._androidContentDescriptionUpdated === false && textValue === tnsView['_lastText'] && titleValue === tnsView['_lastTitle']) {
        return androidView.getContentDescription();
    }
    var contentDescriptionBuilder = new Array();
    if (tnsView.accessibilityRole === view_common_1.AccessibilityRole.Switch) {
        var androidSwitch = new android.widget.Switch(nsApp.android.context);
        if (tnsView.accessibilityState === view_common_1.AccessibilityState.Checked) {
            contentDescriptionBuilder.push(androidSwitch.getTextOn());
        }
        else {
            contentDescriptionBuilder.push(androidSwitch.getTextOff());
        }
    }
    var accessibilityLabel = (tnsView.accessibilityLabel || '').trim();
    var accessibilityValue = (tnsView.accessibilityValue || '').trim();
    var accessibilityHint = (tnsView.accessibilityHint || '').trim();
    if (accessibilityLabel) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + " - have accessibilityLabel");
        }
        contentDescriptionBuilder.push("" + accessibilityLabel);
    }
    if (accessibilityValue) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + " - have accessibilityValue");
        }
        contentDescriptionBuilder.push("" + accessibilityValue);
    }
    else if (textValue) {
        if (!accessibilityLabel || textValue.toLowerCase() !== accessibilityLabel.toLowerCase()) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - don't have accessibilityValue - use 'text' value");
            }
            contentDescriptionBuilder.push("" + textValue);
        }
    }
    else if (titleValue) {
        if (!accessibilityLabel || titleValue.toLowerCase() !== accessibilityLabel.toLowerCase()) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace(cls + " - don't have accessibilityValue - use 'title' value");
            }
            contentDescriptionBuilder.push("" + titleValue);
        }
    }
    if (accessibilityHint) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + " - have accessibilityHint");
        }
        contentDescriptionBuilder.push("" + accessibilityHint);
    }
    var contentDescription = contentDescriptionBuilder
        .join('. ')
        .trim()
        .replace(/^\.$/, '');
    if (contentDescription) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + " - set to \"" + contentDescription + "\"");
        }
        androidView.setContentDescription(contentDescription);
    }
    else {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace(cls + " - remove value");
        }
        androidView.setContentDescription(null);
    }
    tnsView['_lastTitle'] = titleValue;
    tnsView['_lastText'] = textValue;
    tnsView._androidContentDescriptionUpdated = false;
    return contentDescription;
});
var ensureListViewItemIsOnScreen = profiling_1.profile('ensureListViewItemIsOnScreen', function ensureListViewItemIsOnScreenImpl(listView, tnsView) {
    if (suspendAccessibilityEvents) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ") suspended");
        }
        return;
    }
    if (trace_1.isTraceEnabled()) {
        writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ")");
    }
    var androidListView = exports.getAndroidView(listView);
    if (!androidListView) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ") no native list-view?");
        }
        return;
    }
    var androidView = exports.getAndroidView(tnsView);
    if (!androidView) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ") no native item view?");
        }
        return;
    }
    try {
        removeAccessibilityDelegate(tnsView);
        suspendAccessibilityEvents = true;
        var viewSize = tnsView.getActualSize();
        var viewPos = tnsView.getLocationRelativeTo(listView);
        var listViewSize = listView.getActualSize();
        var viewPosDelta = {
            x2: viewSize.width + viewPos.x,
            y2: viewSize.height + viewPos.y,
        };
        var offsetPadding = 10;
        var minOffset = offsetPadding;
        var maxOffset = listViewSize.height - offsetPadding;
        if (viewPos.y >= minOffset && viewPosDelta.y2 <= maxOffset) {
            if (trace_1.isTraceEnabled()) {
                writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ") view is on screen " + viewPos.y + " >= " + minOffset + " && " + viewPosDelta.y2 + " <= " + maxOffset);
            }
            return;
        }
        var wantedScrollOffset = viewPos.y < 0 ? offsetPadding : listViewSize.height - viewSize.height - offsetPadding;
        var scrollByDIP = viewPos.y - wantedScrollOffset;
        var scrollByDP = utils.layout.toDevicePixels(scrollByDIP);
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("ensureListViewItemIsOnScreen(" + listView + ", " + tnsView + ") view is not on screen, scroll by: " + scrollByDIP);
        }
        androidx.core.widget.ListViewCompat.scrollListBy(androidListView, scrollByDP);
    }
    catch (err) {
        trace_1.writeErrorTrace(err);
    }
    finally {
        suspendAccessibilityEvents = false;
        AccessibilityHelper.updateAccessibilityProperties(tnsView);
    }
});
function setupA11yScrollOnFocus(args) {
    var listView = args.object;
    var tnsView = args.view;
    if (!tnsView) {
        return;
    }
    setAccessibilityDelegate(tnsView);
    if (tnsView.hasListeners(a11yScrollOnFocus)) {
        if (trace_1.isTraceEnabled()) {
            writeHelperTrace("setupA11yScrollOnFocus(): " + listView + " view=" + tnsView + " - item already has " + a11yScrollOnFocus);
        }
        return;
    }
    if (trace_1.isTraceEnabled()) {
        writeHelperTrace("setupA11yScrollOnFocus(): " + listView + " view=" + tnsView);
    }
    var listViewRef = new WeakRef(listView);
    tnsView.on(a11yScrollOnFocus, function (evt) {
        var localListView = listViewRef.get();
        if (!localListView) {
            evt.object.off(a11yScrollOnFocus);
            return;
        }
        ensureListViewItemIsOnScreen(localListView, evt.object);
    });
}
helpers_1.hmrSafeEvents('setupA11yScrollOnFocus', [list_view_1.ListView.itemLoadingEvent], list_view_1.ListView, setupA11yScrollOnFocus);
helpers_1.hmrSafeEvents('setAccessibilityDelegate:loadedEvent', [view_1.View.loadedEvent], view_1.View, function (evt) {
    AccessibilityHelper.updateAccessibilityProperties(evt.object);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjZXNzaWJpbGl0eUhlbHBlci5hbmRyb2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQWNjZXNzaWJpbGl0eUhlbHBlci5hbmRyb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0RBQXdEO0FBQ3hELDBEQUF1RDtBQUN2RCxnREFBa0Q7QUFDbEQsd0RBQWtFO0FBQ2xFLG9FQUF1RTtBQUN2RSx1RUFBcUU7QUFDckUsbUZBQWdGO0FBQ2hGLHNEQUF3RDtBQUN4RCxrQ0FBbUY7QUFDbkYsc0RBQStFO0FBQy9FLHFDQUF5RTtBQUN6RSxpQ0FBd0Q7QUFFeEQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFlLEVBQUUsSUFBNkI7SUFBN0IscUJBQUEsRUFBQSxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtJQUN0RSxrQkFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsa0JBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRVksUUFBQSxjQUFjLEdBQUcsbUJBQU8sQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLGtCQUFrQixDQUE4QixPQUFnQjtJQUMvSCxPQUFPLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG1CQUFtQixDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBZ0IsU0FBUyxDQUFDLE9BQWdCO0lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBYSxPQUFPLDBDQUF1QyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUZELDhCQUVDO0FBRUQsSUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztBQUV6RSxJQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0FBRTdFLElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUM7QUFDbkYscUJB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QyxpQkFBaUIsQ0FBQyxFQUFFO1FBQzNDLElBQUksc0JBQWMsRUFBRSxFQUFFO1lBQ3BCLGdCQUFnQixDQUFDLCtCQUE2QixRQUFRLGNBQVMsT0FBTyw0QkFBdUIsaUJBQW1CLENBQUMsQ0FBQztTQUNuSDtRQUVELE9BQU87S0FDUjtJQUVELElBQUksc0JBQWMsRUFBRSxFQUFFO1FBQ3BCLGdCQUFnQixDQUFDLCtCQUE2QixRQUFRLGNBQVMsT0FBUyxDQUFDLENBQUM7S0FDM0U7SUFFRCxJQUFNLFdBQVcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQXFCLEdBQUc7UUFDcEQsSUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVsQyxPQUFPO1NBQ1I7UUFFRCw0QkFBNEIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLE1BQWlCLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCx1QkFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsb0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLG9CQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUN2Ryx1QkFBYSxDQUFDLHNDQUFzQyxFQUFFLENBQUMsV0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQU8sRUFBRSxVQUFxQixHQUFHO0lBRTVHLG1CQUFtQixDQUFDLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5zQXBwIGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS9hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBwcm9maWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3Byb2ZpbGluZyc7XG5pbXBvcnQgKiBhcyB0cmFjZSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdHJhY2UnO1xuaW1wb3J0IHsgVmlldyBhcyBUTlNWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2NvcmUvdmlldyc7XG5pbXBvcnQgeyBHZXN0dXJlVHlwZXMgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvZ2VzdHVyZXMvZ2VzdHVyZXMnO1xuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGlzdC12aWV3L2xpc3Qtdmlldyc7XG5pbXBvcnQgeyBQcm94eVZpZXdDb250YWluZXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvcHJveHktdmlldy1jb250YWluZXInO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IGNhdGVnb3JpZXMsIGlzVHJhY2VFbmFibGVkLCB3cml0ZUVycm9yVHJhY2UsIHdyaXRlVHJhY2UgfSBmcm9tICcuLi90cmFjZSc7XG5pbXBvcnQgeyBBY2Nlc3NpYmlsaXR5Um9sZSwgQWNjZXNzaWJpbGl0eVN0YXRlIH0gZnJvbSAnLi4vdWkvY29yZS92aWV3LWNvbW1vbic7XG5pbXBvcnQgeyBobXJTYWZlRXZlbnRzLCBub3RpZnlBY2Nlc3NpYmlsaXR5Rm9jdXNTdGF0ZSB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBpc0FjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZCB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiB3cml0ZUhlbHBlclRyYWNlKG1lc3NhZ2U6IHN0cmluZywgdHlwZSA9IHRyYWNlLm1lc3NhZ2VUeXBlLmluZm8pIHtcbiAgd3JpdGVUcmFjZShtZXNzYWdlLCB0eXBlLCBjYXRlZ29yaWVzLkFuZHJvaWRIZWxwZXIpO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0QW5kcm9pZFZpZXcgPSBwcm9maWxlKCdnZXRBbmRyb2lkVmlldycsIGZ1bmN0aW9uIGdldEFuZHJvaWRWaWV3SW1wbDxUIGV4dGVuZHMgYW5kcm9pZC52aWV3LlZpZXc+KHRuc1ZpZXc6IFROU1ZpZXcpOiBUIHtcbiAgcmV0dXJuIHRuc1ZpZXcubmF0aXZlVmlldyB8fCB0bnNWaWV3Lm5hdGl2ZVZpZXdQcm90ZWN0ZWQ7XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVJVmlldyh0bnNWaWV3OiBUTlNWaWV3KTogVUlWaWV3IHtcbiAgdGhyb3cgbmV3IEVycm9yKGBnZXRVSVZpZXcoJHt0bnNWaWV3fSkgLSBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkIG9uIEFuZHJvaWRgKTtcbn1cblxuY29uc3QgQWNjZXNzaWJpbGl0eUV2ZW50ID0gYW5kcm9pZC52aWV3LmFjY2Vzc2liaWxpdHkuQWNjZXNzaWJpbGl0eUV2ZW50O1xudHlwZSBBY2Nlc3NpYmlsaXR5RXZlbnQgPSBhbmRyb2lkLnZpZXcuYWNjZXNzaWJpbGl0eS5BY2Nlc3NpYmlsaXR5RXZlbnQ7XG5jb25zdCBBY2Nlc3NpYmlsaXR5TWFuYWdlciA9IGFuZHJvaWQudmlldy5hY2Nlc3NpYmlsaXR5LkFjY2Vzc2liaWxpdHlNYW5hZ2VyO1xudHlwZSBBY2Nlc3NpYmlsaXR5TWFuYWdlciA9IGFuZHJvaWQudmlldy5hY2Nlc3NpYmlsaXR5LkFjY2Vzc2liaWxpdHlNYW5hZ2VyO1xubGV0IEFjY2Vzc2liaWxpdHlEZWxlZ2F0ZSA9IGFuZHJvaWQudmlldy5WaWV3LmFuZHJvaWR2aWV3Vmlld0FjY2Vzc2liaWxpdHlEZWxlZ2F0ZTtcbkFjY2Vzc2liaWxpdHlEZWxlZ2F0ZSA9IChhbmRyb2lkLnZpZXcuVmlldyBhcyBhbnkpLkFjY2Vzc2liaWxpdHlEZWxlZ2F0ZTtcbnR5cGUgQWNjZXNzaWJpbGl0eURlbGVnYXRlID0gYW5kcm9pZC52aWV3LlZpZXcuQWNjZXNzaWJpbGl0eURlbGVnYXRlO1xuY29uc3QgQWNjZXNzaWJpbGl0eU5vZGVJbmZvID0gYW5kcm9pZC52aWV3LmFjY2Vzc2liaWxpdHkuQWNjZXNzaWJpbGl0eU5vZGVJbmZvO1xudHlwZSBBY2Nlc3NpYmlsaXR5Tm9kZUluZm8gPSBhbmRyb2lkLnZpZXcuYWNjZXNzaWJpbGl0eS5BY2Nlc3NpYmlsaXR5Tm9kZUluZm87XG5jb25zdCBBbmRyb2lkVmlldyA9IGFuZHJvaWQudmlldy5WaWV3O1xudHlwZSBBbmRyb2lkVmlldyA9IGFuZHJvaWQudmlldy5WaWV3O1xuY29uc3QgQW5kcm9pZFZpZXdHcm91cCA9IGFuZHJvaWQudmlldy5WaWV3R3JvdXA7XG50eXBlIEFuZHJvaWRWaWV3R3JvdXAgPSBhbmRyb2lkLnZpZXcuVmlld0dyb3VwO1xubGV0IGNsaWNrYWJsZVJvbGVzTWFwID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmNvbnN0IGdldEFjY2Vzc2liaWxpdHlNYW5hZ2VyID0gcHJvZmlsZSgnZ2V0QWNjZXNzaWJpbGl0eU1hbmFnZXInLCBmdW5jdGlvbiBnZXRBY2Nlc3NpYmlsaXR5TWFuYWdlckltcGwodmlldzogQW5kcm9pZFZpZXcpOiBBY2Nlc3NpYmlsaXR5TWFuYWdlciB7XG4gIHJldHVybiB2aWV3LmdldENvbnRleHQoKS5nZXRTeXN0ZW1TZXJ2aWNlKGFuZHJvaWQuY29udGVudC5Db250ZXh0LkFDQ0VTU0lCSUxJVFlfU0VSVklDRSk7XG59KTtcblxubGV0IHN1c3BlbmRBY2Nlc3NpYmlsaXR5RXZlbnRzID0gZmFsc2U7XG5jb25zdCBhMTF5U2Nyb2xsT25Gb2N1cyA9ICdhMTF5LXNjcm9sbC1vbi1mb2N1cyc7XG5sZXQgbGFzdEZvY3VzZWRWaWV3OiBXZWFrUmVmPFROU1ZpZXc+O1xuY29uc3QgYWNjZXNzaWJpbGl0eUV2ZW50SGVscGVyID0gcHJvZmlsZSgnYWNjZXNzaWJpbGl0eUV2ZW50SGVscGVyJywgZnVuY3Rpb24gYWNjZXNzaWJpbGl0eUV2ZW50SGVscGVySW1wbCh0bnNWaWV3OiBUTlNWaWV3LCBldmVudFR5cGU6IG51bWJlcikge1xuICBjb25zdCBldmVudE5hbWUgPSBhY2Nlc3NpYmlsaXR5RXZlbnRUeXBlTWFwLmdldChldmVudFR5cGUpO1xuICBpZiAoIWlzQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkKCkpIHtcbiAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgd3JpdGVIZWxwZXJUcmFjZShgYWNjZXNzaWJpbGl0eUV2ZW50SGVscGVyOiBTZXJ2aWNlIG5vdCBhY3RpdmVgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWV2ZW50TmFtZSkge1xuICAgIHdyaXRlSGVscGVyVHJhY2UoYGFjY2Vzc2liaWxpdHlFdmVudEhlbHBlcjogdW5rbm93biBldmVudFR5cGU6ICR7ZXZlbnRUeXBlfWAsIHRyYWNlLm1lc3NhZ2VUeXBlLmVycm9yKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghdG5zVmlldykge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZUhlbHBlclRyYWNlKGBhY2Nlc3NpYmlsaXR5RXZlbnRIZWxwZXI6IG5vIG93bmVyOiAke2V2ZW50TmFtZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgYW5kcm9pZFZpZXcgPSBnZXRBbmRyb2lkVmlldyh0bnNWaWV3KTtcbiAgaWYgKCFhbmRyb2lkVmlldykge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZUhlbHBlclRyYWNlKGBhY2Nlc3NpYmlsaXR5RXZlbnRIZWxwZXI6IG5vIG5hdGl2ZVZpZXdgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKGV2ZW50VHlwZSkge1xuICAgIGNhc2UgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19DTElDS0VEOiB7XG4gICAgICAvKipcbiAgICAgICAqIEFuZHJvaWQgQVBJID49IDI2IGhhbmRsZXMgYWNjZXNzaWJpbGl0eSB0YXAtZXZlbnRzIGJ5IGNvbnZlcnRpbmcgdGhlbSB0byBUWVBFX1ZJRVdfQ0xJQ0tFRFxuICAgICAgICogVGhlc2UgYXJlbid0IHRyaWdnZXJlZCBmb3IgY3VzdG9tIHRhcCBldmVudHMgaW4gTmF0aXZlU2NyaXB0LlxuICAgICAgICovXG4gICAgICBpZiAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gMjYpIHtcbiAgICAgICAgLy8gRmluZCBhbGwgdGFwIGdlc3R1cmVzIGFuZCB0cmlnZ2VyIHRoZW0uXG4gICAgICAgIGZvciAoY29uc3QgdGFwR2VzdHVyZSBvZiB0bnNWaWV3LmdldEdlc3R1cmVPYnNlcnZlcnMoR2VzdHVyZVR5cGVzLnRhcCkgfHwgW10pIHtcbiAgICAgICAgICB0YXBHZXN0dXJlLmNhbGxiYWNrKHtcbiAgICAgICAgICAgIGFuZHJvaWQ6IHRuc1ZpZXcuYW5kcm9pZCxcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3RhcCcsXG4gICAgICAgICAgICBpb3M6IG51bGwsXG4gICAgICAgICAgICBvYmplY3Q6IHRuc1ZpZXcsXG4gICAgICAgICAgICB0eXBlOiBHZXN0dXJlVHlwZXMudGFwLFxuICAgICAgICAgICAgdmlldzogdG5zVmlldyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNhc2UgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19BQ0NFU1NJQklMSVRZX0ZPQ1VTRUQ6IHtcbiAgICAgIGNvbnN0IGxhc3RWaWV3ID0gbGFzdEZvY3VzZWRWaWV3ICYmIGxhc3RGb2N1c2VkVmlldy5nZXQoKTtcbiAgICAgIGlmIChsYXN0VmlldyAmJiB0bnNWaWV3ICE9PSBsYXN0Vmlldykge1xuICAgICAgICBjb25zdCBsYXN0QW5kcm9pZFZpZXcgPSBnZXRBbmRyb2lkVmlldyhsYXN0Vmlldyk7XG4gICAgICAgIGlmIChsYXN0QW5kcm9pZFZpZXcpIHtcbiAgICAgICAgICBsYXN0QW5kcm9pZFZpZXcuY2xlYXJGb2N1cygpO1xuICAgICAgICAgIGxhc3RGb2N1c2VkVmlldyA9IG51bGw7XG5cbiAgICAgICAgICBub3RpZnlBY2Nlc3NpYmlsaXR5Rm9jdXNTdGF0ZShsYXN0VmlldywgZmFsc2UsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxhc3RGb2N1c2VkVmlldyA9IG5ldyBXZWFrUmVmKHRuc1ZpZXcpO1xuXG4gICAgICBub3RpZnlBY2Nlc3NpYmlsaXR5Rm9jdXNTdGF0ZSh0bnNWaWV3LCB0cnVlLCBmYWxzZSk7XG5cbiAgICAgIGNvbnN0IHRyZWUgPSBbXSBhcyBzdHJpbmdbXTtcblxuICAgICAgZm9yIChsZXQgbm9kZSA9IHRuc1ZpZXc7IG5vZGU7IG5vZGUgPSBub2RlLnBhcmVudCBhcyBUTlNWaWV3KSB7XG4gICAgICAgIG5vZGUubm90aWZ5KHtcbiAgICAgICAgICBldmVudE5hbWU6IGExMXlTY3JvbGxPbkZvY3VzLFxuICAgICAgICAgIG9iamVjdDogdG5zVmlldyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdHJlZS5wdXNoKGAke25vZGV9WyR7bm9kZS5jbGFzc05hbWUgfHwgJyd9XWApO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGBGb2N1cy10cmVlOiAke3RyZWUucmV2ZXJzZSgpLmpvaW4oJyA9PiAnKX1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYXNlIEFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX1ZJRVdfQUNDRVNTSUJJTElUWV9GT0NVU19DTEVBUkVEOiB7XG4gICAgICBjb25zdCBsYXN0VmlldyA9IGxhc3RGb2N1c2VkVmlldyAmJiBsYXN0Rm9jdXNlZFZpZXcuZ2V0KCk7XG4gICAgICBpZiAobGFzdFZpZXcgJiYgdG5zVmlldyA9PT0gbGFzdFZpZXcpIHtcbiAgICAgICAgbGFzdEZvY3VzZWRWaWV3ID0gbnVsbDtcbiAgICAgICAgYW5kcm9pZFZpZXcuY2xlYXJGb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBub3RpZnlBY2Nlc3NpYmlsaXR5Rm9jdXNTdGF0ZSh0bnNWaWV3LCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn0pO1xuXG5sZXQgVE5TQWNjZXNzaWJpbGl0eURlbGVnYXRlOiBBY2Nlc3NpYmlsaXR5RGVsZWdhdGU7XG5cbmNvbnN0IGFuZHJvaWRWaWV3VG9UTlNWaWV3ID0gbmV3IFdlYWtNYXA8QW5kcm9pZFZpZXcsIFdlYWtSZWY8VE5TVmlldz4+KCk7XG5cbmxldCBhY2Nlc3NpYmlsaXR5RXZlbnRNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj47XG5sZXQgYWNjZXNzaWJpbGl0eUV2ZW50VHlwZU1hcDogTWFwPG51bWJlciwgc3RyaW5nPjtcbmZ1bmN0aW9uIGVuc3VyZU5hdGl2ZUNsYXNzZXMoKSB7XG4gIGlmIChUTlNBY2Nlc3NpYmlsaXR5RGVsZWdhdGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBSb2xlVHlwZU1hcCA9IG5ldyBNYXA8QWNjZXNzaWJpbGl0eVJvbGUsIHN0cmluZz4oW1xuICAgIFtBY2Nlc3NpYmlsaXR5Um9sZS5CdXR0b24sIGFuZHJvaWQud2lkZ2V0LkJ1dHRvbi5jbGFzcy5nZXROYW1lKCldLFxuICAgIFtBY2Nlc3NpYmlsaXR5Um9sZS5TZWFyY2gsIGFuZHJvaWQud2lkZ2V0LkVkaXRUZXh0LmNsYXNzLmdldE5hbWUoKV0sXG4gICAgW0FjY2Vzc2liaWxpdHlSb2xlLkltYWdlLCBhbmRyb2lkLndpZGdldC5JbWFnZVZpZXcuY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuSW1hZ2VCdXR0b24sIGFuZHJvaWQud2lkZ2V0LkltYWdlQnV0dG9uLmNsYXNzLmdldE5hbWUoKV0sXG4gICAgW0FjY2Vzc2liaWxpdHlSb2xlLktleWJvYXJkS2V5LCBhbmRyb2lkLmlucHV0bWV0aG9kc2VydmljZS5LZXlib2FyZC5LZXkuY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuU3RhdGljVGV4dCwgYW5kcm9pZC53aWRnZXQuVGV4dFZpZXcuY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuQWRqdXN0YWJsZSwgYW5kcm9pZC53aWRnZXQuU2Vla0Jhci5jbGFzcy5nZXROYW1lKCldLFxuICAgIFtBY2Nlc3NpYmlsaXR5Um9sZS5DaGVja2JveCwgYW5kcm9pZC53aWRnZXQuQ2hlY2tCb3guY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuUmFkaW9CdXR0b24sIGFuZHJvaWQud2lkZ2V0LlJhZGlvQnV0dG9uLmNsYXNzLmdldE5hbWUoKV0sXG4gICAgW0FjY2Vzc2liaWxpdHlSb2xlLlNwaW5CdXR0b24sIGFuZHJvaWQud2lkZ2V0LlNwaW5uZXIuY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuU3dpdGNoLCBhbmRyb2lkLndpZGdldC5Td2l0Y2guY2xhc3MuZ2V0TmFtZSgpXSxcbiAgICBbQWNjZXNzaWJpbGl0eVJvbGUuUHJvZ3Jlc3NCYXIsIGFuZHJvaWQud2lkZ2V0LlByb2dyZXNzQmFyLmNsYXNzLmdldE5hbWUoKV0sXG4gIF0pO1xuXG4gIGNsaWNrYWJsZVJvbGVzTWFwID0gbmV3IFNldDxzdHJpbmc+KFtBY2Nlc3NpYmlsaXR5Um9sZS5CdXR0b24sIEFjY2Vzc2liaWxpdHlSb2xlLkltYWdlQnV0dG9uXSk7XG5cbiAgY29uc3QgaWdub3JlUm9sZVR5cGVzRm9yVHJhY2UgPSBuZXcgU2V0KFtBY2Nlc3NpYmlsaXR5Um9sZS5IZWFkZXIsIEFjY2Vzc2liaWxpdHlSb2xlLkxpbmssIEFjY2Vzc2liaWxpdHlSb2xlLk5vbmUsIEFjY2Vzc2liaWxpdHlSb2xlLlN1bW1hcnldKTtcblxuICBjbGFzcyBUTlNBY2Nlc3NpYmlsaXR5RGVsZWdhdGVJbXBsIGV4dGVuZHMgQWNjZXNzaWJpbGl0eURlbGVnYXRlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIHJldHVybiBnbG9iYWwuX19uYXRpdmUodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUbnNWaWV3KHZpZXc6IEFuZHJvaWRWaWV3KSB7XG4gICAgICBpZiAoIWFuZHJvaWRWaWV3VG9UTlNWaWV3Lmhhcyh2aWV3KSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG5zVmlldyA9IGFuZHJvaWRWaWV3VG9UTlNWaWV3LmdldCh2aWV3KS5nZXQoKTtcbiAgICAgIGlmICghdG5zVmlldykge1xuICAgICAgICBhbmRyb2lkVmlld1RvVE5TVmlldy5kZWxldGUodmlldyk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0bnNWaWV3O1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkluaXRpYWxpemVBY2Nlc3NpYmlsaXR5Tm9kZUluZm8oaG9zdDogQW5kcm9pZFZpZXcsIGluZm86IEFjY2Vzc2liaWxpdHlOb2RlSW5mbykge1xuICAgICAgc3VwZXIub25Jbml0aWFsaXplQWNjZXNzaWJpbGl0eU5vZGVJbmZvKGhvc3QsIGluZm8pO1xuXG4gICAgICBjb25zdCB0bnNWaWV3ID0gdGhpcy5nZXRUbnNWaWV3KGhvc3QpO1xuICAgICAgaWYgKCF0bnNWaWV3KSB7XG4gICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgd3JpdGVIZWxwZXJUcmFjZShgb25Jbml0aWFsaXplQWNjZXNzaWJpbGl0eU5vZGVJbmZvICR7aG9zdH0gJHtpbmZvfSBubyB0bnMtdmlld2ApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhY2Nlc3NpYmlsaXR5Um9sZSA9IHRuc1ZpZXcuYWNjZXNzaWJpbGl0eVJvbGUgYXMgQWNjZXNzaWJpbGl0eVJvbGU7XG4gICAgICBpZiAoYWNjZXNzaWJpbGl0eVJvbGUpIHtcbiAgICAgICAgY29uc3QgYW5kcm9pZENsYXNzTmFtZSA9IFJvbGVUeXBlTWFwLmdldChhY2Nlc3NpYmlsaXR5Um9sZSk7XG4gICAgICAgIGlmIChhbmRyb2lkQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgY29uc3Qgb2xkQ2xhc3NOYW1lID0gaW5mby5nZXRDbGFzc05hbWUoKSB8fCAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gMjggJiYgaG9zdC5nZXRBY2Nlc3NpYmlsaXR5Q2xhc3NOYW1lKCkpIHx8IG51bGw7XG4gICAgICAgICAgaW5mby5zZXRDbGFzc05hbWUoYW5kcm9pZENsYXNzTmFtZSk7XG5cbiAgICAgICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgd3JpdGVIZWxwZXJUcmFjZShcbiAgICAgICAgICAgICAgYCR7dG5zVmlld30uYWNjZXNzaWJpbGl0eVJvbGUgPSBcIiR7YWNjZXNzaWJpbGl0eVJvbGV9XCIgaXMgbWFwcGVkIHRvIFwiJHthbmRyb2lkQ2xhc3NOYW1lfVwiICh3YXMgJHtvbGRDbGFzc05hbWV9KS4gJHtpbmZvLmdldENsYXNzTmFtZSgpfWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghaWdub3JlUm9sZVR5cGVzRm9yVHJhY2UuaGFzKGFjY2Vzc2liaWxpdHlSb2xlIGFzIEFjY2Vzc2liaWxpdHlSb2xlKSkge1xuICAgICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGAke3Ruc1ZpZXd9LmFjY2Vzc2liaWxpdHlSb2xlID0gXCIke2FjY2Vzc2liaWxpdHlSb2xlfVwiIGlzIHVua25vd25gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xpY2thYmxlUm9sZXNNYXAuaGFzKGFjY2Vzc2liaWxpdHlSb2xlKSkge1xuICAgICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGBvbkluaXRpYWxpemVBY2Nlc3NpYmlsaXR5Tm9kZUluZm8gJHt0bnNWaWV3fSAtIHNldCBjbGlja2FibGUgcm9sZT0ke2FjY2Vzc2liaWxpdHlSb2xlfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluZm8uc2V0Q2xpY2thYmxlKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IDI4KSB7XG4gICAgICAgICAgaWYgKGFjY2Vzc2liaWxpdHlSb2xlID09PSBBY2Nlc3NpYmlsaXR5Um9sZS5IZWFkZXIpIHtcbiAgICAgICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgIHdyaXRlSGVscGVyVHJhY2UoYG9uSW5pdGlhbGl6ZUFjY2Vzc2liaWxpdHlOb2RlSW5mbyAke3Ruc1ZpZXd9IC0gc2V0IGhlYWRpbmcgcm9sZT0ke2FjY2Vzc2liaWxpdHlSb2xlfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmZvLnNldEhlYWRpbmcodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChob3N0LmlzQWNjZXNzaWJpbGl0eUhlYWRpbmcoKSkge1xuICAgICAgICAgICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgd3JpdGVIZWxwZXJUcmFjZShgb25Jbml0aWFsaXplQWNjZXNzaWJpbGl0eU5vZGVJbmZvICR7dG5zVmlld30gLSBzZXQgaGVhZGluZyBmcm9tIGhvc3RgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5mby5zZXRIZWFkaW5nKHRydWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGBvbkluaXRpYWxpemVBY2Nlc3NpYmlsaXR5Tm9kZUluZm8gJHt0bnNWaWV3fSAtIHNldCBub3QgaGVhZGluZ2ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbmZvLnNldEhlYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYWNjZXNzaWJpbGl0eVJvbGUpIHtcbiAgICAgICAgICBjYXNlIEFjY2Vzc2liaWxpdHlSb2xlLlN3aXRjaDpcbiAgICAgICAgICBjYXNlIEFjY2Vzc2liaWxpdHlSb2xlLlJhZGlvQnV0dG9uOlxuICAgICAgICAgIGNhc2UgQWNjZXNzaWJpbGl0eVJvbGUuQ2hlY2tib3g6IHtcbiAgICAgICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgIHdyaXRlSGVscGVyVHJhY2UoXG4gICAgICAgICAgICAgICAgYG9uSW5pdGlhbGl6ZUFjY2Vzc2liaWxpdHlOb2RlSW5mbyAke3Ruc1ZpZXd9IC0gc2V0IGNoZWNrYWJsZSBhbmQgY2hlY2s9JHt0bnNWaWV3LmFjY2Vzc2liaWxpdHlTdGF0ZSA9PT0gQWNjZXNzaWJpbGl0eVN0YXRlLkNoZWNrZWR9YCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5mby5zZXRDaGVja2FibGUodHJ1ZSk7XG4gICAgICAgICAgICBpbmZvLnNldENoZWNrZWQodG5zVmlldy5hY2Nlc3NpYmlsaXR5U3RhdGUgPT09IEFjY2Vzc2liaWxpdHlTdGF0ZS5DaGVja2VkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICB3cml0ZUhlbHBlclRyYWNlKFxuICAgICAgICAgICAgICAgIGBvbkluaXRpYWxpemVBY2Nlc3NpYmlsaXR5Tm9kZUluZm8gJHt0bnNWaWV3fSAtIHNldCBlbmFibGVkPSR7dG5zVmlldy5hY2Nlc3NpYmlsaXR5U3RhdGUgIT09XG4gICAgICAgICAgICAgICAgICBBY2Nlc3NpYmlsaXR5U3RhdGUuRGlzYWJsZWR9IGFuZCBzZWxlY3RlZD0ke3Ruc1ZpZXcuYWNjZXNzaWJpbGl0eVN0YXRlID09PSBBY2Nlc3NpYmlsaXR5U3RhdGUuU2VsZWN0ZWR9YCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5mby5zZXRFbmFibGVkKHRuc1ZpZXcuYWNjZXNzaWJpbGl0eVN0YXRlICE9PSBBY2Nlc3NpYmlsaXR5U3RhdGUuRGlzYWJsZWQpO1xuICAgICAgICAgICAgaW5mby5zZXRTZWxlY3RlZCh0bnNWaWV3LmFjY2Vzc2liaWxpdHlTdGF0ZSA9PT0gQWNjZXNzaWJpbGl0eVN0YXRlLlNlbGVjdGVkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodG5zVmlldy5hY2Nlc3NpYmxlID09PSB0cnVlKSB7XG4gICAgICAgIGluZm8uc2V0Rm9jdXNhYmxlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkluaXRpYWxpemVBY2Nlc3NpYmlsaXR5RXZlbnQodmlldzogQW5kcm9pZFZpZXcsIGV2ZW50OiBBY2Nlc3NpYmlsaXR5RXZlbnQpIHtcbiAgICAgIC8vIGZvciBkZWJ1Z2dlclxuICAgICAgc3VwZXIub25Jbml0aWFsaXplQWNjZXNzaWJpbGl0eUV2ZW50KHZpZXcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Qb3B1bGF0ZUFjY2Vzc2liaWxpdHlFdmVudCh2aWV3OiBBbmRyb2lkVmlldywgZXZlbnQ6IEFjY2Vzc2liaWxpdHlFdmVudCkge1xuICAgICAgLy8gZm9yIGRlYnVnZ2VyXG4gICAgICBzdXBlci5vblBvcHVsYXRlQWNjZXNzaWJpbGl0eUV2ZW50KHZpZXcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzcGF0Y2hQb3B1bGF0ZUFjY2Vzc2liaWxpdHlFdmVudCh2aWV3OiBBbmRyb2lkVmlldywgZXZlbnQ6IEFjY2Vzc2liaWxpdHlFdmVudCkge1xuICAgICAgLy8gZm9yIGRlYnVnZ2VyXG4gICAgICByZXR1cm4gc3VwZXIuZGlzcGF0Y2hQb3B1bGF0ZUFjY2Vzc2liaWxpdHlFdmVudCh2aWV3LCBldmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoaG9zdDogQW5kcm9pZFZpZXdHcm91cCwgZXZlbnRUeXBlOiBudW1iZXIpIHtcbiAgICAgIHN1cGVyLnNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoaG9zdCwgZXZlbnRUeXBlKTtcbiAgICAgIGNvbnN0IHRuc1ZpZXcgPSB0aGlzLmdldFRuc1ZpZXcoaG9zdCk7XG4gICAgICBpZiAoIXRuc1ZpZXcpIHtcbiAgICAgICAgY29uc29sZS5sb2coYHNraXAgLSAke2hvc3R9IC0gJHthY2Nlc3NpYmlsaXR5RXZlbnRUeXBlTWFwLmdldChldmVudFR5cGUpfWApO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1c3BlbmRBY2Nlc3NpYmlsaXR5RXZlbnRzKSB7XG4gICAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgd3JpdGVIZWxwZXJUcmFjZShgc2VuZEFjY2Vzc2liaWxpdHlFdmVudDogJHt0bnNWaWV3fSAtIHNraXBgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgYWNjZXNzaWJpbGl0eUV2ZW50SGVscGVyKHRuc1ZpZXcsIGV2ZW50VHlwZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvblJlcXVlc3RTZW5kQWNjZXNzaWJpbGl0eUV2ZW50KGhvc3Q6IEFuZHJvaWRWaWV3R3JvdXAsIHZpZXc6IEFuZHJvaWRWaWV3LCBldmVudDogQWNjZXNzaWJpbGl0eUV2ZW50KSB7XG4gICAgICBpZiAoc3VzcGVuZEFjY2Vzc2liaWxpdHlFdmVudHMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIub25SZXF1ZXN0U2VuZEFjY2Vzc2liaWxpdHlFdmVudChob3N0LCB2aWV3LCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgVE5TQWNjZXNzaWJpbGl0eURlbGVnYXRlID0gbmV3IFROU0FjY2Vzc2liaWxpdHlEZWxlZ2F0ZUltcGwoKTtcblxuICBhY2Nlc3NpYmlsaXR5RXZlbnRNYXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPihbXG4gICAgLyoqXG4gICAgICogSW52YWxpZCBzZWxlY3Rpb24vZm9jdXMgcG9zaXRpb24uXG4gICAgICovXG4gICAgWydpbnZhbGlkX3Bvc2l0aW9uJywgQWNjZXNzaWJpbGl0eUV2ZW50LklOVkFMSURfUE9TSVRJT05dLFxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbGVuZ3RoIG9mIHRoZSB0ZXh0IGZpZWxkcy5cbiAgICAgKi9cbiAgICBbJ21heF90ZXh0X2xlbmd0aCcsIEFjY2Vzc2liaWxpdHlFdmVudC5NQVhfVEVYVF9MRU5HVEhdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIGNsaWNraW5nIG9uIGEgYW5kcm9pZC52aWV3LlZpZXcgbGlrZSBhbmRyb2lkLndpZGdldC5CdXR0b24sIGFuZHJvaWQud2lkZ2V0LkNvbXBvdW5kQnV0dG9uLCBldGMuXG4gICAgICovXG4gICAgWyd2aWV3X2NsaWNrZWQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9WSUVXX0NMSUNLRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIGxvbmcgY2xpY2tpbmcgb24gYSBhbmRyb2lkLnZpZXcuVmlldyBsaWtlIGFuZHJvaWQud2lkZ2V0LkJ1dHRvbiwgYW5kcm9pZC53aWRnZXQuQ29tcG91bmRCdXR0b24sIGV0Yy5cbiAgICAgKi9cbiAgICBbJ3ZpZXdfbG9uZ19jbGlja2VkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19MT05HX0NMSUNLRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIHNlbGVjdGluZyBhbiBpdGVtIHVzdWFsbHkgaW4gdGhlIGNvbnRleHQgb2YgYW4gYW5kcm9pZC53aWRnZXQuQWRhcHRlclZpZXcuXG4gICAgICovXG4gICAgWyd2aWV3X3NlbGVjdGVkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19TRUxFQ1RFRF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2Ygc2V0dGluZyBpbnB1dCBmb2N1cyBvZiBhIGFuZHJvaWQudmlldy5WaWV3LlxuICAgICAqL1xuICAgIFsndmlld19mb2N1c2VkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19GT0NVU0VEXSxcbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBldmVudCBvZiBjaGFuZ2luZyB0aGUgdGV4dCBvZiBhbiBhbmRyb2lkLndpZGdldC5FZGl0VGV4dC5cbiAgICAgKi9cbiAgICBbJ3ZpZXdfdGV4dF9jaGFuZ2VkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19URVhUX0NIQU5HRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIG9wZW5pbmcgYSBhbmRyb2lkLndpZGdldC5Qb3B1cFdpbmRvdywgYW5kcm9pZC52aWV3Lk1lbnUsIGFuZHJvaWQuYXBwLkRpYWxvZywgZXRjLlxuICAgICAqL1xuICAgIFsnd2luZG93X3N0YXRlX2NoYW5nZWQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9XSU5ET1dfU1RBVEVfQ0hBTkdFRF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgc2hvd2luZyBhIGFuZHJvaWQuYXBwLk5vdGlmaWNhdGlvbi5cbiAgICAgKi9cbiAgICBbJ25vdGlmaWNhdGlvbl9zdGF0ZV9jaGFuZ2VkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfTk9USUZJQ0FUSU9OX1NUQVRFX0NIQU5HRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIGEgaG92ZXIgZW50ZXIgb3ZlciBhIGFuZHJvaWQudmlldy5WaWV3LlxuICAgICAqL1xuICAgIFsndmlld19ob3Zlcl9lbnRlcicsIEFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX1ZJRVdfSE9WRVJfRU5URVJdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIGEgaG92ZXIgZXhpdCBvdmVyIGEgYW5kcm9pZC52aWV3LlZpZXcuXG4gICAgICovXG4gICAgWyd2aWV3X2hvdmVyX2V4aXQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9WSUVXX0hPVkVSX0VYSVRdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIHN0YXJ0aW5nIGEgdG91Y2ggZXhwbG9yYXRpb24gZ2VzdHVyZS5cbiAgICAgKi9cbiAgICBbJ3RvdWNoX2V4cGxvcmF0aW9uX2dlc3R1cmVfc3RhcnQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9UT1VDSF9FWFBMT1JBVElPTl9HRVNUVVJFX1NUQVJUXSxcbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBldmVudCBvZiBlbmRpbmcgYSB0b3VjaCBleHBsb3JhdGlvbiBnZXN0dXJlLlxuICAgICAqL1xuICAgIFsndG91Y2hfZXhwbG9yYXRpb25fZ2VzdHVyZV9lbmQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9UT1VDSF9FWFBMT1JBVElPTl9HRVNUVVJFX0VORF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgY2hhbmdpbmcgdGhlIGNvbnRlbnQgb2YgYSB3aW5kb3cgYW5kIG1vcmUgc3BlY2lmaWNhbGx5IHRoZSBzdWItdHJlZSByb290ZWQgYXQgdGhlIGV2ZW50J3Mgc291cmNlLlxuICAgICAqL1xuICAgIFsnd2luZG93X2NvbnRlbnRfY2hhbmdlZCcsIEFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX1dJTkRPV19DT05URU5UX0NIQU5HRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIHNjcm9sbGluZyBhIHZpZXcuXG4gICAgICovXG4gICAgWyd2aWV3X3Njcm9sbGVkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19TQ1JPTExFRF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiBpbiBhbiBhbmRyb2lkLndpZGdldC5FZGl0VGV4dC5cbiAgICAgKi9cbiAgICBbJ3ZpZXdfdGV4dF9zZWxlY3Rpb25fY2hhbmdlZCcsIEFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX1ZJRVdfVEVYVF9TRUxFQ1RJT05fQ0hBTkdFRF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgYW4gYXBwbGljYXRpb24gbWFraW5nIGFuIGFubm91bmNlbWVudC5cbiAgICAgKi9cbiAgICBbJ2Fubm91bmNlbWVudCcsIEFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX0FOTk9VTkNFTUVOVF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgZ2FpbmluZyBhY2Nlc3NpYmlsaXR5IGZvY3VzLlxuICAgICAqL1xuICAgIFsndmlld19hY2Nlc3NpYmlsaXR5X2ZvY3VzZWQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9WSUVXX0FDQ0VTU0lCSUxJVFlfRk9DVVNFRF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgY2xlYXJpbmcgYWNjZXNzaWJpbGl0eSBmb2N1cy5cbiAgICAgKi9cbiAgICBbJ3ZpZXdfYWNjZXNzaWJpbGl0eV9mb2N1c19jbGVhcmVkJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19BQ0NFU1NJQklMSVRZX0ZPQ1VTX0NMRUFSRURdLFxuICAgIC8qKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIGV2ZW50IG9mIHRyYXZlcnNpbmcgdGhlIHRleHQgb2YgYSB2aWV3IGF0IGEgZ2l2ZW4gbW92ZW1lbnQgZ3JhbnVsYXJpdHkuXG4gICAgICovXG4gICAgWyd2aWV3X3RleHRfdHJhdmVyc2VkX2F0X21vdmVtZW50X2dyYW51bGFyaXR5JywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19URVhUX1RSQVZFUlNFRF9BVF9NT1ZFTUVOVF9HUkFOVUxBUklUWV0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgYmVnaW5uaW5nIGdlc3R1cmUgZGV0ZWN0aW9uLlxuICAgICAqL1xuICAgIFsnZ2VzdHVyZV9kZXRlY3Rpb25fc3RhcnQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9HRVNUVVJFX0RFVEVDVElPTl9TVEFSVF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgZW5kaW5nIGdlc3R1cmUgZGV0ZWN0aW9uLlxuICAgICAqL1xuICAgIFsnZ2VzdHVyZV9kZXRlY3Rpb25fZW5kJywgQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfR0VTVFVSRV9ERVRFQ1RJT05fRU5EXSxcbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBldmVudCBvZiB0aGUgdXNlciBzdGFydGluZyB0byB0b3VjaCB0aGUgc2NyZWVuLlxuICAgICAqL1xuICAgIFsndG91Y2hfaW50ZXJhY3Rpb25fc3RhcnQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9UT1VDSF9JTlRFUkFDVElPTl9TVEFSVF0sXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZXZlbnQgb2YgdGhlIHVzZXIgZW5kaW5nIHRvIHRvdWNoIHRoZSBzY3JlZW4uXG4gICAgICovXG4gICAgWyd0b3VjaF9pbnRlcmFjdGlvbl9lbmQnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9UT1VDSF9JTlRFUkFDVElPTl9FTkRdLFxuICAgIC8qKlxuICAgICAqIE1hc2sgZm9yIEFjY2Vzc2liaWxpdHlFdmVudCBhbGwgdHlwZXMuXG4gICAgICovXG4gICAgWydhbGwnLCBBY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRVNfQUxMX01BU0tdLFxuICBdKTtcblxuICBhY2Nlc3NpYmlsaXR5RXZlbnRUeXBlTWFwID0gbmV3IE1hcChbLi4uYWNjZXNzaWJpbGl0eUV2ZW50TWFwXS5tYXAoKFtrLCB2XSkgPT4gW3YsIGtdKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBBY2Nlc3NpYmlsaXR5SGVscGVyIHtcbiAgQHByb2ZpbGVcbiAgcHVibGljIHN0YXRpYyB1cGRhdGVBY2Nlc3NpYmlsaXR5UHJvcGVydGllcyh0bnNWaWV3OiBUTlNWaWV3KSB7XG4gICAgaWYgKHRuc1ZpZXcgaW5zdGFuY2VvZiBQcm94eVZpZXdDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldEFjY2Vzc2liaWxpdHlEZWxlZ2F0ZSh0bnNWaWV3KTtcbiAgICBhcHBseUNvbnRlbnREZXNjcmlwdGlvbih0bnNWaWV3KTtcbiAgfVxuXG4gIEBwcm9maWxlXG4gIHB1YmxpYyBzdGF0aWMgc2VuZEFjY2Vzc2liaWxpdHlFdmVudCh0bnNWaWV3OiBUTlNWaWV3LCBldmVudE5hbWU6IHN0cmluZywgdGV4dD86IHN0cmluZykge1xuICAgIGNvbnN0IGNscyA9IGBBY2Nlc3NpYmlsaXR5SGVscGVyLnNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoJHt0bnNWaWV3fSwgJHtldmVudE5hbWV9LCAke3RleHR9KWA7XG5cbiAgICBjb25zdCBhbmRyb2lkVmlldyA9IGdldEFuZHJvaWRWaWV3KHRuc1ZpZXcpO1xuICAgIGlmICghYW5kcm9pZFZpZXcpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfTogbm8gbmF0aXZlVmlld2ApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfTogbm8gZXZlbnROYW1lIHByb3ZpZGVkYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWlzQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkKCkpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfSAtIFRhbGtCYWNrIG5vdCBlbmFibGVkYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhMTF5U2VydmljZSA9IGdldEFjY2Vzc2liaWxpdHlNYW5hZ2VyKGFuZHJvaWRWaWV3KTtcbiAgICBpZiAoIWExMXlTZXJ2aWNlLmlzRW5hYmxlZCgpKSB7XG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGAke2Nsc30gLSBhMTF5U2VydmljZSBub3QgZW5hYmxlZGApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnROYW1lID0gZXZlbnROYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFhY2Nlc3NpYmlsaXR5RXZlbnRNYXAuaGFzKGV2ZW50TmFtZSkpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfSAtIHVua25vd24gZXZlbnRgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBldmVudEludCA9IGFjY2Vzc2liaWxpdHlFdmVudE1hcC5nZXQoZXZlbnROYW1lKTtcblxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIGFuZHJvaWRWaWV3LnNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoZXZlbnRJbnQpO1xuICAgIH1cblxuICAgIGNvbnN0IGExMXlFdmVudCA9IEFjY2Vzc2liaWxpdHlFdmVudC5vYnRhaW4oZXZlbnRJbnQpO1xuICAgIGExMXlFdmVudC5zZXRTb3VyY2UoYW5kcm9pZFZpZXcpO1xuXG4gICAgYTExeUV2ZW50LmdldFRleHQoKS5jbGVhcigpO1xuXG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICBhcHBseUNvbnRlbnREZXNjcmlwdGlvbih0bnNWaWV3KTtcblxuICAgICAgdGV4dCA9IGFuZHJvaWRWaWV3LmdldENvbnRlbnREZXNjcmlwdGlvbigpIHx8IHRuc1ZpZXdbJ3RpdGxlJ107XG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGAke2Nsc30gLSB0ZXh0IG5vdCBwcm92aWRlZCB1c2UgYW5kcm9pZFZpZXcuZ2V0Q29udGVudERlc2NyaXB0aW9uKCkgLSAke3RleHR9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfTogc2VuZCBldmVudCB3aXRoIHRleHQ6ICcke0pTT04uc3RyaW5naWZ5KHRleHQpfSdgKTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkge1xuICAgICAgYTExeUV2ZW50LmdldFRleHQoKS5hZGQodGV4dCk7XG4gICAgfVxuXG4gICAgYTExeVNlcnZpY2Uuc2VuZEFjY2Vzc2liaWxpdHlFdmVudChhMTF5RXZlbnQpO1xuICB9XG5cbiAgQHByb2ZpbGVcbiAgcHVibGljIHN0YXRpYyB1cGRhdGVDb250ZW50RGVzY3JpcHRpb24odG5zVmlldzogVE5TVmlldywgZm9yY2VVcGRhdGUgPSBmYWxzZSkge1xuICAgIGlmICh0bnNWaWV3IGluc3RhbmNlb2YgUHJveHlWaWV3Q29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXBwbHlDb250ZW50RGVzY3JpcHRpb24odG5zVmlldywgZm9yY2VVcGRhdGUpO1xuICB9XG59XG5cbmNvbnN0IHJlbW92ZUFjY2Vzc2liaWxpdHlEZWxlZ2F0ZSA9IHByb2ZpbGUoJ3JlbW92ZUFjY2Vzc2liaWxpdHlEZWxlZ2F0ZScsIGZ1bmN0aW9uIHJlbW92ZUFjY2Vzc2liaWxpdHlEZWxlZ2F0ZUltcGwodG5zVmlldzogVE5TVmlldykge1xuICBpZiAodG5zVmlldyBpbnN0YW5jZW9mIFByb3h5Vmlld0NvbnRhaW5lcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgYW5kcm9pZFZpZXcgPSBnZXRBbmRyb2lkVmlldyh0bnNWaWV3KTtcbiAgaWYgKCFhbmRyb2lkVmlldykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGFuZHJvaWRWaWV3VG9UTlNWaWV3LmRlbGV0ZShhbmRyb2lkVmlldyk7XG4gIGFuZHJvaWRWaWV3LnNldEFjY2Vzc2liaWxpdHlEZWxlZ2F0ZShudWxsKTtcbn0pO1xuXG5jb25zdCBzZXRBY2Nlc3NpYmlsaXR5RGVsZWdhdGUgPSBwcm9maWxlKCdzZXRBY2Nlc3NpYmlsaXR5RGVsZWdhdGUnLCBmdW5jdGlvbiBzZXRBY2Nlc3NpYmlsaXR5RGVsZWdhdGVJbXBsKHRuc1ZpZXc6IFROU1ZpZXcpIHtcbiAgaWYgKHRuc1ZpZXcgaW5zdGFuY2VvZiBQcm94eVZpZXdDb250YWluZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGVuc3VyZU5hdGl2ZUNsYXNzZXMoKTtcblxuICBjb25zdCBhbmRyb2lkVmlldyA9IGdldEFuZHJvaWRWaWV3KHRuc1ZpZXcpO1xuICBpZiAoIWFuZHJvaWRWaWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYW5kcm9pZFZpZXdUb1ROU1ZpZXcuc2V0KGFuZHJvaWRWaWV3LCBuZXcgV2Vha1JlZih0bnNWaWV3KSk7XG5cbiAgY29uc3QgaGFzT2xkRGVsZWdhdGUgPSBhbmRyb2lkVmlldy5nZXRBY2Nlc3NpYmlsaXR5RGVsZWdhdGUoKSA9PT0gVE5TQWNjZXNzaWJpbGl0eURlbGVnYXRlO1xuXG4gIGNvbnN0IGNscyA9IGBBY2Nlc3NpYmlsaXR5SGVscGVyLnVwZGF0ZUFjY2Vzc2liaWxpdHlQcm9wZXJ0aWVzKCR7dG5zVmlld30pIC0gaGFzIGRlbGVnYXRlPyAke2hhc09sZERlbGVnYXRlfWA7XG4gIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgd3JpdGVIZWxwZXJUcmFjZShjbHMpO1xuICB9XG5cbiAgaWYgKGhhc09sZERlbGVnYXRlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYW5kcm9pZFZpZXcuc2V0QWNjZXNzaWJpbGl0eURlbGVnYXRlKFROU0FjY2Vzc2liaWxpdHlEZWxlZ2F0ZSk7XG59KTtcblxuY29uc3QgYXBwbHlDb250ZW50RGVzY3JpcHRpb24gPSBwcm9maWxlKCdhcHBseUNvbnRlbnREZXNjcmlwdGlvbicsIGZ1bmN0aW9uIGFwcGx5Q29udGVudERlc2NyaXB0aW9uSW1wbCh0bnNWaWV3OiBUTlNWaWV3LCBmb3JjZVVwZGF0ZT86IGJvb2xlYW4pIHtcbiAgaWYgKHRuc1ZpZXcgaW5zdGFuY2VvZiBQcm94eVZpZXdDb250YWluZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBhbmRyb2lkVmlldyA9IGdldEFuZHJvaWRWaWV3PGFuZHJvaWQudmlldy5WaWV3Pih0bnNWaWV3KTtcblxuICBpZiAoYW5kcm9pZFZpZXcgaW5zdGFuY2VvZiBhbmRyb2lkeC5hcHBjb21wYXQud2lkZ2V0LlRvb2xiYXIpIHtcbiAgICBjb25zdCBudW1DaGlsZHJlbiA9IGFuZHJvaWRWaWV3LmdldENoaWxkQ291bnQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ2hpbGRyZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgY2hpbGRBbmRyb2lkVmlldyA9IGFuZHJvaWRWaWV3LmdldENoaWxkQXQoaSk7XG4gICAgICBpZiAoY2hpbGRBbmRyb2lkVmlldyBpbnN0YW5jZW9mIGFuZHJvaWR4LmFwcGNvbXBhdC53aWRnZXQuQXBwQ29tcGF0VGV4dFZpZXcpIHtcbiAgICAgICAgYW5kcm9pZFZpZXcgPSBjaGlsZEFuZHJvaWRWaWV3O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBjbHMgPSBgYXBwbHlDb250ZW50RGVzY3JpcHRpb24oJHt0bnNWaWV3fSlgO1xuICBpZiAoIWFuZHJvaWRWaWV3KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB0aXRsZVZhbHVlID0gKCh0bnNWaWV3Wyd0aXRsZSddIGFzIHN0cmluZykgfHwgJycpLnRvU3RyaW5nKCkudHJpbSgpO1xuICBjb25zdCB0ZXh0VmFsdWUgPSAoKHRuc1ZpZXdbJ3RleHQnXSBhcyBzdHJpbmcpIHx8ICcnKS50b1N0cmluZygpLnRyaW0oKTtcblxuICBpZiAoIWZvcmNlVXBkYXRlICYmIHRuc1ZpZXcuX2FuZHJvaWRDb250ZW50RGVzY3JpcHRpb25VcGRhdGVkID09PSBmYWxzZSAmJiB0ZXh0VmFsdWUgPT09IHRuc1ZpZXdbJ19sYXN0VGV4dCddICYmIHRpdGxlVmFsdWUgPT09IHRuc1ZpZXdbJ19sYXN0VGl0bGUnXSkge1xuICAgIC8vIHByZXZlbnQgdXBkYXRpbmcgdGhpcyB0b28gbXVjaFxuICAgIHJldHVybiBhbmRyb2lkVmlldy5nZXRDb250ZW50RGVzY3JpcHRpb24oKTtcbiAgfVxuXG4gIGxldCBjb250ZW50RGVzY3JpcHRpb25CdWlsZGVyID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAvLyBXb3JrYXJvdW5kOiBUYWxrQmFjayB3b24ndCByZWFkIHRoZSBjaGVja2VkIHN0YXRlIGZvciBmYWtlIFN3aXRjaC5cbiAgaWYgKHRuc1ZpZXcuYWNjZXNzaWJpbGl0eVJvbGUgPT09IEFjY2Vzc2liaWxpdHlSb2xlLlN3aXRjaCkge1xuICAgIGNvbnN0IGFuZHJvaWRTd2l0Y2ggPSBuZXcgYW5kcm9pZC53aWRnZXQuU3dpdGNoKG5zQXBwLmFuZHJvaWQuY29udGV4dCk7XG4gICAgaWYgKHRuc1ZpZXcuYWNjZXNzaWJpbGl0eVN0YXRlID09PSBBY2Nlc3NpYmlsaXR5U3RhdGUuQ2hlY2tlZCkge1xuICAgICAgY29udGVudERlc2NyaXB0aW9uQnVpbGRlci5wdXNoKGFuZHJvaWRTd2l0Y2guZ2V0VGV4dE9uKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50RGVzY3JpcHRpb25CdWlsZGVyLnB1c2goYW5kcm9pZFN3aXRjaC5nZXRUZXh0T2ZmKCkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFjY2Vzc2liaWxpdHlMYWJlbCA9ICh0bnNWaWV3LmFjY2Vzc2liaWxpdHlMYWJlbCB8fCAnJykudHJpbSgpO1xuICBjb25zdCBhY2Nlc3NpYmlsaXR5VmFsdWUgPSAodG5zVmlldy5hY2Nlc3NpYmlsaXR5VmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgY29uc3QgYWNjZXNzaWJpbGl0eUhpbnQgPSAodG5zVmlldy5hY2Nlc3NpYmlsaXR5SGludCB8fCAnJykudHJpbSgpO1xuICBpZiAoYWNjZXNzaWJpbGl0eUxhYmVsKSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfSAtIGhhdmUgYWNjZXNzaWJpbGl0eUxhYmVsYCk7XG4gICAgfVxuXG4gICAgY29udGVudERlc2NyaXB0aW9uQnVpbGRlci5wdXNoKGAke2FjY2Vzc2liaWxpdHlMYWJlbH1gKTtcbiAgfVxuXG4gIGlmIChhY2Nlc3NpYmlsaXR5VmFsdWUpIHtcbiAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgd3JpdGVIZWxwZXJUcmFjZShgJHtjbHN9IC0gaGF2ZSBhY2Nlc3NpYmlsaXR5VmFsdWVgKTtcbiAgICB9XG5cbiAgICBjb250ZW50RGVzY3JpcHRpb25CdWlsZGVyLnB1c2goYCR7YWNjZXNzaWJpbGl0eVZhbHVlfWApO1xuICB9IGVsc2UgaWYgKHRleHRWYWx1ZSkge1xuICAgIGlmICghYWNjZXNzaWJpbGl0eUxhYmVsIHx8IHRleHRWYWx1ZS50b0xvd2VyQ2FzZSgpICE9PSBhY2Nlc3NpYmlsaXR5TGFiZWwudG9Mb3dlckNhc2UoKSkge1xuICAgICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgICAgd3JpdGVIZWxwZXJUcmFjZShgJHtjbHN9IC0gZG9uJ3QgaGF2ZSBhY2Nlc3NpYmlsaXR5VmFsdWUgLSB1c2UgJ3RleHQnIHZhbHVlYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnREZXNjcmlwdGlvbkJ1aWxkZXIucHVzaChgJHt0ZXh0VmFsdWV9YCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHRpdGxlVmFsdWUpIHtcbiAgICBpZiAoIWFjY2Vzc2liaWxpdHlMYWJlbCB8fCB0aXRsZVZhbHVlLnRvTG93ZXJDYXNlKCkgIT09IGFjY2Vzc2liaWxpdHlMYWJlbC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZUhlbHBlclRyYWNlKGAke2Nsc30gLSBkb24ndCBoYXZlIGFjY2Vzc2liaWxpdHlWYWx1ZSAtIHVzZSAndGl0bGUnIHZhbHVlYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnREZXNjcmlwdGlvbkJ1aWxkZXIucHVzaChgJHt0aXRsZVZhbHVlfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhY2Nlc3NpYmlsaXR5SGludCkge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZUhlbHBlclRyYWNlKGAke2Nsc30gLSBoYXZlIGFjY2Vzc2liaWxpdHlIaW50YCk7XG4gICAgfVxuXG4gICAgY29udGVudERlc2NyaXB0aW9uQnVpbGRlci5wdXNoKGAke2FjY2Vzc2liaWxpdHlIaW50fWApO1xuICB9XG5cbiAgY29uc3QgY29udGVudERlc2NyaXB0aW9uID0gY29udGVudERlc2NyaXB0aW9uQnVpbGRlclxuICAgIC5qb2luKCcuICcpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9eXFwuJC8sICcnKTtcblxuICBpZiAoY29udGVudERlc2NyaXB0aW9uKSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfSAtIHNldCB0byBcIiR7Y29udGVudERlc2NyaXB0aW9ufVwiYCk7XG4gICAgfVxuXG4gICAgYW5kcm9pZFZpZXcuc2V0Q29udGVudERlc2NyaXB0aW9uKGNvbnRlbnREZXNjcmlwdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYCR7Y2xzfSAtIHJlbW92ZSB2YWx1ZWApO1xuICAgIH1cblxuICAgIGFuZHJvaWRWaWV3LnNldENvbnRlbnREZXNjcmlwdGlvbihudWxsKTtcbiAgfVxuXG4gIHRuc1ZpZXdbJ19sYXN0VGl0bGUnXSA9IHRpdGxlVmFsdWU7XG4gIHRuc1ZpZXdbJ19sYXN0VGV4dCddID0gdGV4dFZhbHVlO1xuICB0bnNWaWV3Ll9hbmRyb2lkQ29udGVudERlc2NyaXB0aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBjb250ZW50RGVzY3JpcHRpb247XG59KTtcblxuLyoqXG4gKiBXaGVuIHRoZSB1c2VyIG5hdmlnYXRlcyB0byBhIExpc3RWaWV3IGl0ZW0sIHdlIG5lZWQgdG8ga2VlcCBpdCBvbiBzY3JlZW4uXG4gKiBPdGhlcndpc2Ugd2UgcmlzayBidWdneSBiZWhhdmlvciwgd2hlcmUgdGhlIExpc3RWaWV3IGp1bXBzIHRvIHRoZSB0b3Agb3Igc2VsZWN0cyBhIDwgaGFsZlxuICogdmlzaWJsZSBlbGVtZW50LlxuICovXG5jb25zdCBlbnN1cmVMaXN0Vmlld0l0ZW1Jc09uU2NyZWVuID0gcHJvZmlsZSgnZW5zdXJlTGlzdFZpZXdJdGVtSXNPblNjcmVlbicsIGZ1bmN0aW9uIGVuc3VyZUxpc3RWaWV3SXRlbUlzT25TY3JlZW5JbXBsKGxpc3RWaWV3OiBMaXN0VmlldywgdG5zVmlldzogVE5TVmlldykge1xuICBpZiAoc3VzcGVuZEFjY2Vzc2liaWxpdHlFdmVudHMpIHtcbiAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgd3JpdGVIZWxwZXJUcmFjZShgZW5zdXJlTGlzdFZpZXdJdGVtSXNPblNjcmVlbigke2xpc3RWaWV3fSwgJHt0bnNWaWV3fSkgc3VzcGVuZGVkYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICB3cml0ZUhlbHBlclRyYWNlKGBlbnN1cmVMaXN0Vmlld0l0ZW1Jc09uU2NyZWVuKCR7bGlzdFZpZXd9LCAke3Ruc1ZpZXd9KWApO1xuICB9XG5cbiAgY29uc3QgYW5kcm9pZExpc3RWaWV3ID0gZ2V0QW5kcm9pZFZpZXcobGlzdFZpZXcpIGFzIGFuZHJvaWQud2lkZ2V0Lkxpc3RWaWV3O1xuICBpZiAoIWFuZHJvaWRMaXN0Vmlldykge1xuICAgIC8vIFRoaXMgcmVhbGx5IHNob3VsZG4ndCBoYXBwZW4sIGJ1dCBqdXN0IGluIGNhc2UuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYGVuc3VyZUxpc3RWaWV3SXRlbUlzT25TY3JlZW4oJHtsaXN0Vmlld30sICR7dG5zVmlld30pIG5vIG5hdGl2ZSBsaXN0LXZpZXc/YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYW5kcm9pZFZpZXcgPSBnZXRBbmRyb2lkVmlldyh0bnNWaWV3KTtcbiAgaWYgKCFhbmRyb2lkVmlldykge1xuICAgIC8vIFRoaXMgcmVhbGx5IHNob3VsZG4ndCBoYXBwZW4sIGJ1dCBqdXN0IGluIGNhc2UuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYGVuc3VyZUxpc3RWaWV3SXRlbUlzT25TY3JlZW4oJHtsaXN0Vmlld30sICR7dG5zVmlld30pIG5vIG5hdGl2ZSBpdGVtIHZpZXc/YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBSZW1vdmUgQWNjZXNzaWJpbGl0eSBkZWxlZ2F0ZSB0byBwcmV2ZW50IGluZmluaXRlIGxvb3AgdHJpZ2dlcmVkIGJ5IHRoZSBldmVudHMuXG4gICAgcmVtb3ZlQWNjZXNzaWJpbGl0eURlbGVnYXRlKHRuc1ZpZXcpO1xuXG4gICAgc3VzcGVuZEFjY2Vzc2liaWxpdHlFdmVudHMgPSB0cnVlO1xuXG4gICAgY29uc3Qgdmlld1NpemUgPSB0bnNWaWV3LmdldEFjdHVhbFNpemUoKTtcbiAgICBjb25zdCB2aWV3UG9zID0gdG5zVmlldy5nZXRMb2NhdGlvblJlbGF0aXZlVG8obGlzdFZpZXcpO1xuICAgIGNvbnN0IGxpc3RWaWV3U2l6ZSA9IGxpc3RWaWV3LmdldEFjdHVhbFNpemUoKTtcblxuICAgIGNvbnN0IHZpZXdQb3NEZWx0YSA9IHtcbiAgICAgIHgyOiB2aWV3U2l6ZS53aWR0aCArIHZpZXdQb3MueCxcbiAgICAgIHkyOiB2aWV3U2l6ZS5oZWlnaHQgKyB2aWV3UG9zLnksXG4gICAgfTtcblxuICAgIC8vIFRvIG1ha2Ugc3VyZSB0aGUgcHJldi9uZXh0IGVsZW1lbnQgZXhpc3RzIGFkZCBhIHNtYWxsIHBhZGRpbmdcbiAgICBjb25zdCBvZmZzZXRQYWRkaW5nID0gMTA7XG5cbiAgICAvLyBNaW5pbXVtIHktb2Zmc2V0IGZvciB0aGUgdmlldyB0byBiZSBvbiBzY3JlZW4uXG4gICAgY29uc3QgbWluT2Zmc2V0ID0gb2Zmc2V0UGFkZGluZztcblxuICAgIC8vIE1heGltdW0geS1vZmZzZXQgZm9yIHRoZSB2aWV3IHRvIGJlIG9uIHNjcmVlblxuICAgIGNvbnN0IG1heE9mZnNldCA9IGxpc3RWaWV3U2l6ZS5oZWlnaHQgLSBvZmZzZXRQYWRkaW5nO1xuXG4gICAgaWYgKHZpZXdQb3MueSA+PSBtaW5PZmZzZXQgJiYgdmlld1Bvc0RlbHRhLnkyIDw9IG1heE9mZnNldCkge1xuICAgICAgLy8gVGhlIHZpZXcgaXMgb24gc2NyZWVuLCBubyBuZWVkIHRvIHNjcm9sbCBhbnl0aGluZy5cbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlSGVscGVyVHJhY2UoXG4gICAgICAgICAgYGVuc3VyZUxpc3RWaWV3SXRlbUlzT25TY3JlZW4oJHtsaXN0Vmlld30sICR7dG5zVmlld30pIHZpZXcgaXMgb24gc2NyZWVuICR7dmlld1Bvcy55fSA+PSAke21pbk9mZnNldH0gJiYgJHt2aWV3UG9zRGVsdGEueTJ9IDw9ICR7bWF4T2Zmc2V0fWAsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgTGlzdFZpZXcgbmVlZHMgdG8gYmUgc2Nyb2xsZWQuXG4gICAgICpcbiAgICAgKiBMaXN0VmlldyBjYW4gb25seSBiZSBzY3JvbGxlZCByZWxhdGl2ZSB0byB0aGUgY3VycmVudCBwb3NpdGlvbixcbiAgICAgKiBzbyB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB0aGUgcmVsYXRpdmUgc2Nyb2xsQnkgdmFsdWUuXG4gICAgICovXG5cbiAgICAvLyAxc3QgY2FsY3VsYXRlIGF0IHdoaWNoIG9mZnNldCB0aGUgdmlldyBzaG91bGQgZW5kIHVwIGF0LlxuICAgIGNvbnN0IHdhbnRlZFNjcm9sbE9mZnNldCA9IHZpZXdQb3MueSA8IDAgPyBvZmZzZXRQYWRkaW5nIDogbGlzdFZpZXdTaXplLmhlaWdodCAtIHZpZXdTaXplLmhlaWdodCAtIG9mZnNldFBhZGRpbmc7XG5cbiAgICAvLyAybmQgY2FsY3VsYXRlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGN1cnJlbnQgeS1vZmZzZXQgYW5kIHRoZSB3YW50ZWQgb2Zmc2V0LlxuICAgIGNvbnN0IHNjcm9sbEJ5RElQID0gdmlld1Bvcy55IC0gd2FudGVkU2Nyb2xsT2Zmc2V0O1xuXG4gICAgLy8gM25kIGNvbnZlcnQgdG8gcmVhbCBkZXZpY2UgcGl4ZWxzLlxuICAgIGNvbnN0IHNjcm9sbEJ5RFAgPSB1dGlscy5sYXlvdXQudG9EZXZpY2VQaXhlbHMoc2Nyb2xsQnlESVApO1xuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYGVuc3VyZUxpc3RWaWV3SXRlbUlzT25TY3JlZW4oJHtsaXN0Vmlld30sICR7dG5zVmlld30pIHZpZXcgaXMgbm90IG9uIHNjcmVlbiwgc2Nyb2xsIGJ5OiAke3Njcm9sbEJ5RElQfWApO1xuICAgIH1cblxuICAgIC8vIEZpbmFsbHkgc2Nyb2xsIHRoaXMgTGlzdFZpZXcuXG4gICAgLy8gTm90ZTogV2UgZ2V0IGEgYmV0dGVyIHJlc3VsdCBmcm9tIExpc3RWaWV3Q29tcGF0LnNjcm9sbExpc3RCeSB0aGFuIGZyb20gTGlzdFZpZXcuc2Nyb2xsTGlzdEJ5LlxuICAgIGFuZHJvaWR4LmNvcmUud2lkZ2V0Lkxpc3RWaWV3Q29tcGF0LnNjcm9sbExpc3RCeShhbmRyb2lkTGlzdFZpZXcsIHNjcm9sbEJ5RFApO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB3cml0ZUVycm9yVHJhY2UoZXJyKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBzdXNwZW5kQWNjZXNzaWJpbGl0eUV2ZW50cyA9IGZhbHNlO1xuXG4gICAgLy8gUmVzZXQgYWNjZXNzaWJpbGl0eVxuICAgIEFjY2Vzc2liaWxpdHlIZWxwZXIudXBkYXRlQWNjZXNzaWJpbGl0eVByb3BlcnRpZXModG5zVmlldyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBzZXR1cEExMXlTY3JvbGxPbkZvY3VzKGFyZ3M6IGFueSkge1xuICBjb25zdCBsaXN0VmlldyA9IGFyZ3Mub2JqZWN0IGFzIExpc3RWaWV3O1xuICBjb25zdCB0bnNWaWV3ID0gYXJncy52aWV3IGFzIFROU1ZpZXc7XG5cbiAgaWYgKCF0bnNWaWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRW5zdXJlIGFjY2Vzc2liaWxpdHkgZGVsZWdhdGUgaXMgc3RpbGwgYXBwbGllZC4gVGhpcyBpcyB0byBzb2x2ZSAjTk9UQS02ODY2XG4gIHNldEFjY2Vzc2liaWxpdHlEZWxlZ2F0ZSh0bnNWaWV3KTtcblxuICBpZiAodG5zVmlldy5oYXNMaXN0ZW5lcnMoYTExeVNjcm9sbE9uRm9jdXMpKSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlSGVscGVyVHJhY2UoYHNldHVwQTExeVNjcm9sbE9uRm9jdXMoKTogJHtsaXN0Vmlld30gdmlldz0ke3Ruc1ZpZXd9IC0gaXRlbSBhbHJlYWR5IGhhcyAke2ExMXlTY3JvbGxPbkZvY3VzfWApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgd3JpdGVIZWxwZXJUcmFjZShgc2V0dXBBMTF5U2Nyb2xsT25Gb2N1cygpOiAke2xpc3RWaWV3fSB2aWV3PSR7dG5zVmlld31gKTtcbiAgfVxuXG4gIGNvbnN0IGxpc3RWaWV3UmVmID0gbmV3IFdlYWtSZWYobGlzdFZpZXcpO1xuICB0bnNWaWV3Lm9uKGExMXlTY3JvbGxPbkZvY3VzLCBmdW5jdGlvbih0aGlzOiBudWxsLCBldnQpIHtcbiAgICBjb25zdCBsb2NhbExpc3RWaWV3ID0gbGlzdFZpZXdSZWYuZ2V0KCk7XG4gICAgaWYgKCFsb2NhbExpc3RWaWV3KSB7XG4gICAgICBldnQub2JqZWN0Lm9mZihhMTF5U2Nyb2xsT25Gb2N1cyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbnN1cmVMaXN0Vmlld0l0ZW1Jc09uU2NyZWVuKGxvY2FsTGlzdFZpZXcsIGV2dC5vYmplY3QgYXMgVE5TVmlldyk7XG4gIH0pO1xufVxuXG5obXJTYWZlRXZlbnRzKCdzZXR1cEExMXlTY3JvbGxPbkZvY3VzJywgW0xpc3RWaWV3Lml0ZW1Mb2FkaW5nRXZlbnRdLCBMaXN0Vmlldywgc2V0dXBBMTF5U2Nyb2xsT25Gb2N1cyk7XG5obXJTYWZlRXZlbnRzKCdzZXRBY2Nlc3NpYmlsaXR5RGVsZWdhdGU6bG9hZGVkRXZlbnQnLCBbVE5TVmlldy5sb2FkZWRFdmVudF0sIFROU1ZpZXcsIGZ1bmN0aW9uKHRoaXM6IG51bGwsIGV2dCkge1xuICAvLyBTZXQgdGhlIGFjY2Vzc2liaWxpdHkgZGVsZWdhdGUgb24gbG9hZC5cbiAgQWNjZXNzaWJpbGl0eUhlbHBlci51cGRhdGVBY2Nlc3NpYmlsaXR5UHJvcGVydGllcyhldnQub2JqZWN0KTtcbn0pO1xuIl19