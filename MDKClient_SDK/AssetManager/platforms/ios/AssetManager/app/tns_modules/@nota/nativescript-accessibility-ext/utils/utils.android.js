"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var nsApp = require("@nativescript/core/application");
var observable_1 = require("@nativescript/core/data/observable");
var utils = require("@nativescript/core/utils/utils");
var trace_1 = require("../trace");
var utils_common_1 = require("./utils-common");
function getA11YManager() {
    var cls = "getA11YManager()";
    var context = utils.ad.getApplicationContext();
    if (!context) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + ": no context");
        }
        return null;
    }
    return context.getSystemService(android.content.Context.ACCESSIBILITY_SERVICE);
}
var accessibilityStateChangeListener;
var touchExplorationStateChangeListener;
var sharedA11YObservable;
var A11yStateEnabledPropName = 'a11yStateEnabled';
var TouchExplorationStateEnabledPropName = 'touchExplorationStateEnabled';
function updateState() {
    var a11yManager = getA11YManager();
    if (!a11yManager) {
        return;
    }
    sharedA11YObservable.set(A11yStateEnabledPropName, !!a11yManager.isEnabled());
    sharedA11YObservable.set(TouchExplorationStateEnabledPropName, !!a11yManager.isTouchExplorationEnabled());
}
function ensureStateListener() {
    if (accessibilityStateChangeListener) {
        return sharedA11YObservable;
    }
    var a11yManager = getA11YManager();
    sharedA11YObservable = new observable_1.Observable();
    Object.defineProperty(sharedA11YObservable, utils_common_1.AccessibilityServiceEnabledPropName, {
        get: function () {
            return !!this[A11yStateEnabledPropName] && !!this[TouchExplorationStateEnabledPropName];
        },
    });
    if (!a11yManager) {
        sharedA11YObservable.set(A11yStateEnabledPropName, false);
        sharedA11YObservable.set(TouchExplorationStateEnabledPropName, false);
        return sharedA11YObservable;
    }
    accessibilityStateChangeListener = new android.view.accessibility.AccessibilityManager.AccessibilityStateChangeListener({
        onAccessibilityStateChanged: function (enabled) {
            updateState();
            if (trace_1.isTraceEnabled()) {
                trace_1.writeTrace("AccessibilityStateChangeListener state changed to: " + !!enabled);
            }
        },
    });
    touchExplorationStateChangeListener = new android.view.accessibility.AccessibilityManager.TouchExplorationStateChangeListener({
        onTouchExplorationStateChanged: function (enabled) {
            updateState();
            if (trace_1.isTraceEnabled()) {
                trace_1.writeTrace("TouchExplorationStateChangeListener state changed to: " + !!enabled);
            }
        },
    });
    a11yManager.addAccessibilityStateChangeListener(accessibilityStateChangeListener);
    a11yManager.addTouchExplorationStateChangeListener(touchExplorationStateChangeListener);
    updateState();
    nsApp.on(nsApp.resumeEvent, updateState);
    return sharedA11YObservable;
}
function isAccessibilityServiceEnabled() {
    return ensureStateListener().accessibilityServiceEnabled;
}
exports.isAccessibilityServiceEnabled = isAccessibilityServiceEnabled;
nsApp.on(nsApp.exitEvent, function (args) {
    var activity = args.android;
    if (activity && !activity.isFinishing()) {
        return;
    }
    var a11yManager = getA11YManager();
    if (a11yManager) {
        if (accessibilityStateChangeListener) {
            a11yManager.removeAccessibilityStateChangeListener(accessibilityStateChangeListener);
        }
        if (touchExplorationStateChangeListener) {
            a11yManager.removeTouchExplorationStateChangeListener(touchExplorationStateChangeListener);
        }
    }
    accessibilityStateChangeListener = null;
    touchExplorationStateChangeListener = null;
    if (sharedA11YObservable) {
        sharedA11YObservable.removeEventListener(observable_1.Observable.propertyChangeEvent);
        sharedA11YObservable = null;
    }
    nsApp.off(nsApp.resumeEvent, updateState);
});
var AccessibilityServiceEnabledObservable = (function (_super) {
    __extends(AccessibilityServiceEnabledObservable, _super);
    function AccessibilityServiceEnabledObservable() {
        return _super.call(this, ensureStateListener()) || this;
    }
    return AccessibilityServiceEnabledObservable;
}(utils_common_1.CommonA11YServiceEnabledObservable));
exports.AccessibilityServiceEnabledObservable = AccessibilityServiceEnabledObservable;
__export(require("@nativescript/core/utils/utils"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLmFuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBd0Q7QUFDeEQsaUVBQWdFO0FBQ2hFLHNEQUF3RDtBQUN4RCxrQ0FBc0Q7QUFDdEQsK0NBQTZKO0FBRTdKLFNBQVMsY0FBYztJQUNyQixJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztJQUUvQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUE2QixDQUFDO0lBQzVFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixJQUFJLHNCQUFjLEVBQUUsRUFBRTtZQUNwQixrQkFBVSxDQUFJLEdBQUcsaUJBQWMsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFvRCxDQUFDO0FBQ3BJLENBQUM7QUFPRCxJQUFJLGdDQUFrSCxDQUFDO0FBQ3ZILElBQUksbUNBQXdILENBQUM7QUFDN0gsSUFBSSxvQkFBMEMsQ0FBQztBQUUvQyxJQUFNLHdCQUF3QixHQUFHLGtCQUFrQixDQUFDO0FBQ3BELElBQU0sb0NBQW9DLEdBQUcsOEJBQThCLENBQUM7QUFFNUUsU0FBUyxXQUFXO0lBQ2xCLElBQU0sV0FBVyxHQUFHLGNBQWMsRUFBRSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsT0FBTztLQUNSO0lBRUQsb0JBQW9CLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUM5RSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUM7QUFDNUcsQ0FB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LFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUVIO0lBQTJELHlEQUFrQztJQUMzRjtlQUNFLGtCQUFNLG1CQUFtQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNILDRDQUFDO0FBQUQsQ0FBQyxBQUpELENBQTJELGlEQUFrQyxHQUk1RjtBQUpZLHNGQUFxQztBQU1sRCxvREFBK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBuc0FwcCBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS9kYXRhL29ic2VydmFibGUnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IGlzVHJhY2VFbmFibGVkLCB3cml0ZVRyYWNlIH0gZnJvbSAnLi4vdHJhY2UnO1xuaW1wb3J0IHsgQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkUHJvcE5hbWUsIENvbW1vbkExMVlTZXJ2aWNlRW5hYmxlZE9ic2VydmFibGUsIFNoYXJlZEExMVlPYnNlcnZhYmxlIGFzIENvbW1vblNoYXJlZEExMVlPYnNlcnZhYmxlIH0gZnJvbSAnLi91dGlscy1jb21tb24nO1xuXG5mdW5jdGlvbiBnZXRBMTFZTWFuYWdlcigpIHtcbiAgY29uc3QgY2xzID0gYGdldEExMVlNYW5hZ2VyKClgO1xuXG4gIGNvbnN0IGNvbnRleHQgPSB1dGlscy5hZC5nZXRBcHBsaWNhdGlvbkNvbnRleHQoKSBhcyBhbmRyb2lkLmNvbnRlbnQuQ29udGV4dDtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfTogbm8gY29udGV4dGApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQuZ2V0U3lzdGVtU2VydmljZShhbmRyb2lkLmNvbnRlbnQuQ29udGV4dC5BQ0NFU1NJQklMSVRZX1NFUlZJQ0UpIGFzIGFuZHJvaWQudmlldy5hY2Nlc3NpYmlsaXR5LkFjY2Vzc2liaWxpdHlNYW5hZ2VyO1xufVxuXG5pbnRlcmZhY2UgU2hhcmVkQTExWU9ic2VydmFibGUgZXh0ZW5kcyBDb21tb25TaGFyZWRBMTFZT2JzZXJ2YWJsZSB7XG4gIGExMXlTdGF0ZUVuYWJsZWQ/OiBib29sZWFuO1xuICB0b3VjaEV4cGxvcmF0aW9uU3RhdGVFbmFibGVkPzogYm9vbGVhbjtcbn1cblxubGV0IGFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyOiBhbmRyb2lkLnZpZXcuYWNjZXNzaWJpbGl0eS5BY2Nlc3NpYmlsaXR5TWFuYWdlci5BY2Nlc3NpYmlsaXR5U3RhdGVDaGFuZ2VMaXN0ZW5lcjtcbmxldCB0b3VjaEV4cGxvcmF0aW9uU3RhdGVDaGFuZ2VMaXN0ZW5lcjogYW5kcm9pZC52aWV3LmFjY2Vzc2liaWxpdHkuQWNjZXNzaWJpbGl0eU1hbmFnZXIuVG91Y2hFeHBsb3JhdGlvblN0YXRlQ2hhbmdlTGlzdGVuZXI7XG5sZXQgc2hhcmVkQTExWU9ic2VydmFibGU6IFNoYXJlZEExMVlPYnNlcnZhYmxlO1xuXG5jb25zdCBBMTF5U3RhdGVFbmFibGVkUHJvcE5hbWUgPSAnYTExeVN0YXRlRW5hYmxlZCc7XG5jb25zdCBUb3VjaEV4cGxvcmF0aW9uU3RhdGVFbmFibGVkUHJvcE5hbWUgPSAndG91Y2hFeHBsb3JhdGlvblN0YXRlRW5hYmxlZCc7XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlKCkge1xuICBjb25zdCBhMTF5TWFuYWdlciA9IGdldEExMVlNYW5hZ2VyKCk7XG4gIGlmICghYTExeU1hbmFnZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzaGFyZWRBMTFZT2JzZXJ2YWJsZS5zZXQoQTExeVN0YXRlRW5hYmxlZFByb3BOYW1lLCAhIWExMXlNYW5hZ2VyLmlzRW5hYmxlZCgpKTtcbiAgc2hhcmVkQTExWU9ic2VydmFibGUuc2V0KFRvdWNoRXhwbG9yYXRpb25TdGF0ZUVuYWJsZWRQcm9wTmFtZSwgISFhMTF5TWFuYWdlci5pc1RvdWNoRXhwbG9yYXRpb25FbmFibGVkKCkpO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVTdGF0ZUxpc3RlbmVyKCk6IFNoYXJlZEExMVlPYnNlcnZhYmxlIHtcbiAgaWYgKGFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIHNoYXJlZEExMVlPYnNlcnZhYmxlO1xuICB9XG5cbiAgY29uc3QgYTExeU1hbmFnZXIgPSBnZXRBMTFZTWFuYWdlcigpO1xuICBzaGFyZWRBMTFZT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKCkgYXMgU2hhcmVkQTExWU9ic2VydmFibGU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzaGFyZWRBMTFZT2JzZXJ2YWJsZSwgQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkUHJvcE5hbWUsIHtcbiAgICBnZXQodGhpczogU2hhcmVkQTExWU9ic2VydmFibGUpIHtcbiAgICAgIHJldHVybiAhIXRoaXNbQTExeVN0YXRlRW5hYmxlZFByb3BOYW1lXSAmJiAhIXRoaXNbVG91Y2hFeHBsb3JhdGlvblN0YXRlRW5hYmxlZFByb3BOYW1lXTtcbiAgICB9LFxuICB9KTtcblxuICBpZiAoIWExMXlNYW5hZ2VyKSB7XG4gICAgc2hhcmVkQTExWU9ic2VydmFibGUuc2V0KEExMXlTdGF0ZUVuYWJsZWRQcm9wTmFtZSwgZmFsc2UpO1xuICAgIHNoYXJlZEExMVlPYnNlcnZhYmxlLnNldChUb3VjaEV4cGxvcmF0aW9uU3RhdGVFbmFibGVkUHJvcE5hbWUsIGZhbHNlKTtcblxuICAgIHJldHVybiBzaGFyZWRBMTFZT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyID0gbmV3IGFuZHJvaWQudmlldy5hY2Nlc3NpYmlsaXR5LkFjY2Vzc2liaWxpdHlNYW5hZ2VyLkFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyKHtcbiAgICBvbkFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZWQoZW5hYmxlZCkge1xuICAgICAgdXBkYXRlU3RhdGUoKTtcblxuICAgICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgICAgd3JpdGVUcmFjZShgQWNjZXNzaWJpbGl0eVN0YXRlQ2hhbmdlTGlzdGVuZXIgc3RhdGUgY2hhbmdlZCB0bzogJHshIWVuYWJsZWR9YCk7XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG5cbiAgdG91Y2hFeHBsb3JhdGlvblN0YXRlQ2hhbmdlTGlzdGVuZXIgPSBuZXcgYW5kcm9pZC52aWV3LmFjY2Vzc2liaWxpdHkuQWNjZXNzaWJpbGl0eU1hbmFnZXIuVG91Y2hFeHBsb3JhdGlvblN0YXRlQ2hhbmdlTGlzdGVuZXIoe1xuICAgIG9uVG91Y2hFeHBsb3JhdGlvblN0YXRlQ2hhbmdlZChlbmFibGVkKSB7XG4gICAgICB1cGRhdGVTdGF0ZSgpO1xuXG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZVRyYWNlKGBUb3VjaEV4cGxvcmF0aW9uU3RhdGVDaGFuZ2VMaXN0ZW5lciBzdGF0ZSBjaGFuZ2VkIHRvOiAkeyEhZW5hYmxlZH1gKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICBhMTF5TWFuYWdlci5hZGRBY2Nlc3NpYmlsaXR5U3RhdGVDaGFuZ2VMaXN0ZW5lcihhY2Nlc3NpYmlsaXR5U3RhdGVDaGFuZ2VMaXN0ZW5lcik7XG4gIGExMXlNYW5hZ2VyLmFkZFRvdWNoRXhwbG9yYXRpb25TdGF0ZUNoYW5nZUxpc3RlbmVyKHRvdWNoRXhwbG9yYXRpb25TdGF0ZUNoYW5nZUxpc3RlbmVyKTtcblxuICB1cGRhdGVTdGF0ZSgpO1xuXG4gIG5zQXBwLm9uKG5zQXBwLnJlc3VtZUV2ZW50LCB1cGRhdGVTdGF0ZSk7XG5cbiAgcmV0dXJuIHNoYXJlZEExMVlPYnNlcnZhYmxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWQoKSB7XG4gIHJldHVybiBlbnN1cmVTdGF0ZUxpc3RlbmVyKCkuYWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkO1xufVxuXG5uc0FwcC5vbihuc0FwcC5leGl0RXZlbnQsIChhcmdzOiBuc0FwcC5BcHBsaWNhdGlvbkV2ZW50RGF0YSkgPT4ge1xuICBjb25zdCBhY3Rpdml0eSA9IGFyZ3MuYW5kcm9pZCBhcyBhbmRyb2lkLmFwcC5BY3Rpdml0eTtcbiAgaWYgKGFjdGl2aXR5ICYmICFhY3Rpdml0eS5pc0ZpbmlzaGluZygpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYTExeU1hbmFnZXIgPSBnZXRBMTFZTWFuYWdlcigpO1xuICBpZiAoYTExeU1hbmFnZXIpIHtcbiAgICBpZiAoYWNjZXNzaWJpbGl0eVN0YXRlQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgIGExMXlNYW5hZ2VyLnJlbW92ZUFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyKGFjY2Vzc2liaWxpdHlTdGF0ZUNoYW5nZUxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBpZiAodG91Y2hFeHBsb3JhdGlvblN0YXRlQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgIGExMXlNYW5hZ2VyLnJlbW92ZVRvdWNoRXhwbG9yYXRpb25TdGF0ZUNoYW5nZUxpc3RlbmVyKHRvdWNoRXhwbG9yYXRpb25TdGF0ZUNoYW5nZUxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBhY2Nlc3NpYmlsaXR5U3RhdGVDaGFuZ2VMaXN0ZW5lciA9IG51bGw7XG4gIHRvdWNoRXhwbG9yYXRpb25TdGF0ZUNoYW5nZUxpc3RlbmVyID0gbnVsbDtcblxuICBpZiAoc2hhcmVkQTExWU9ic2VydmFibGUpIHtcbiAgICBzaGFyZWRBMTFZT2JzZXJ2YWJsZS5yZW1vdmVFdmVudExpc3RlbmVyKE9ic2VydmFibGUucHJvcGVydHlDaGFuZ2VFdmVudCk7XG4gICAgc2hhcmVkQTExWU9ic2VydmFibGUgPSBudWxsO1xuICB9XG5cbiAgbnNBcHAub2ZmKG5zQXBwLnJlc3VtZUV2ZW50LCB1cGRhdGVTdGF0ZSk7XG59KTtcblxuZXhwb3J0IGNsYXNzIEFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZE9ic2VydmFibGUgZXh0ZW5kcyBDb21tb25BMTFZU2VydmljZUVuYWJsZWRPYnNlcnZhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoZW5zdXJlU3RhdGVMaXN0ZW5lcigpKTtcbiAgfVxufVxuXG5leHBvcnQgKiBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdXRpbHMvdXRpbHMnO1xuIl19