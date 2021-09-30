"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@nativescript/core/ui/action-bar/action-bar"));
var profiling_1 = require("@nativescript/core/profiling");
var action_bar_1 = require("@nativescript/core/ui/action-bar/action-bar");
var utils_1 = require("../../utils");
var AccessibilityHelper_1 = require("../../utils/AccessibilityHelper");
var view_common_1 = require("../core/view-common");
utils_1.setViewFunction(action_bar_1.ActionBar, view_common_1.commonFunctions.accessibilityScreenChanged, profiling_1.profile('ActionBar<A11Y>.accessibilityScreenChanged', function accessibilityScreenChanged() {
    var _this = this;
    var androidView = AccessibilityHelper_1.getAndroidView(this);
    if (!androidView) {
        return;
    }
    var wasFocusable = android.os.Build.VERSION.SDK_INT >= 26 && androidView.getFocusable();
    var hasHeading = android.os.Build.VERSION.SDK_INT >= 28 && androidView.isAccessibilityHeading();
    var importantForA11Y = androidView.getImportantForAccessibility();
    try {
        androidView.setFocusable(false);
        androidView.setImportantForAccessibility(android.view.View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        var announceView = null;
        var numChildren = androidView.getChildCount();
        for (var i = 0; i < numChildren; i += 1) {
            var childView = androidView.getChildAt(i);
            if (!childView) {
                continue;
            }
            childView.setFocusable(true);
            if (childView instanceof androidx.appcompat.widget.AppCompatTextView) {
                announceView = childView;
                if (android.os.Build.VERSION.SDK_INT >= 28) {
                    announceView.setAccessibilityHeading(true);
                }
            }
        }
        if (!announceView) {
            announceView = androidView;
        }
        announceView.setFocusable(true);
        announceView.setImportantForAccessibility(android.view.View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_FOCUSED);
        announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED);
    }
    catch (_a) {
    }
    finally {
        setTimeout(function () {
            var localAndroidView = AccessibilityHelper_1.getAndroidView(_this);
            if (!localAndroidView) {
                return;
            }
            if (android.os.Build.VERSION.SDK_INT >= 28) {
                androidView.setAccessibilityHeading(hasHeading);
            }
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                localAndroidView.setFocusable(wasFocusable);
            }
            localAndroidView.setImportantForAccessibility(importantForA11Y);
        });
    }
}));
try {
    for (var _b = __values(['update', '_onTitlePropertyChanged']), _c = _b.next(); !_c.done; _c = _b.next()) {
        var fnName = _c.value;
        utils_1.wrapFunction(action_bar_1.ActionBar.prototype, fnName, function () {
            AccessibilityHelper_1.AccessibilityHelper.updateContentDescription(this, true);
        }, 'ActionBar');
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWJhci5hbmRyb2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9uLWJhci5hbmRyb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUE0RDtBQUM1RCwwREFBdUQ7QUFDdkQsMEVBQXdFO0FBQ3hFLHFDQUE0RDtBQUM1RCx1RUFBc0Y7QUFDdEYsbURBQXNEO0FBRXRELHVCQUFlLENBQ2Isc0JBQVMsRUFDVCw2QkFBZSxDQUFDLDBCQUEwQixFQUMxQyxtQkFBTyxDQUFDLDRDQUE0QyxFQUFFLFNBQVMsMEJBQTBCO0lBQW5DLGlCQTREckQ7SUEzREMsSUFBTSxXQUFXLEdBQUcsb0NBQWMsQ0FBb0MsSUFBSSxDQUFDLENBQUM7SUFDNUUsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNoQixPQUFPO0tBQ1I7SUFFRCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUYsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbEcsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUVwRSxJQUFJO1FBQ0YsV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUUzRixJQUFJLFlBQVksR0FBNkIsSUFBSSxDQUFDO1FBRWxELElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkMsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLFNBQVM7YUFDVjtZQUVELFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsSUFBSSxTQUFTLFlBQVksUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3BFLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7b0JBQzFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUM7YUFDRjtTQUNGO1FBRUQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixZQUFZLEdBQUcsV0FBVyxDQUFDO1NBQzVCO1FBRUQsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxZQUFZLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUU3RixZQUFZLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNyRyxZQUFZLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsK0JBQStCLENBQUMsQ0FBQztLQUNwSDtJQUFDLFdBQU07S0FFUDtZQUFTO1FBQ1IsVUFBVSxDQUFDO1lBQ1QsSUFBTSxnQkFBZ0IsR0FBRyxvQ0FBYyxDQUFDLEtBQUksQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDckIsT0FBTzthQUNSO1lBRUQsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRTtnQkFDMUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2pEO1lBRUQsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRTtnQkFDMUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzdDO1lBQ0QsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQzs7SUFFRixLQUFxQixJQUFBLEtBQUEsU0FBQSxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFBLGdCQUFBLDRCQUFFO1FBQXZELElBQU0sTUFBTSxXQUFBO1FBQ2Ysb0JBQVksQ0FDVixzQkFBUyxDQUFDLFNBQVMsRUFDbkIsTUFBTSxFQUNOO1lBQ0UseUNBQW1CLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFDRCxXQUFXLENBQ1osQ0FBQztLQUNIIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2FjdGlvbi1iYXIvYWN0aW9uLWJhcic7XG5pbXBvcnQgeyBwcm9maWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3Byb2ZpbGluZyc7XG5pbXBvcnQgeyBBY3Rpb25CYXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvYWN0aW9uLWJhci9hY3Rpb24tYmFyJztcbmltcG9ydCB7IHNldFZpZXdGdW5jdGlvbiwgd3JhcEZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQWNjZXNzaWJpbGl0eUhlbHBlciwgZ2V0QW5kcm9pZFZpZXcgfSBmcm9tICcuLi8uLi91dGlscy9BY2Nlc3NpYmlsaXR5SGVscGVyJztcbmltcG9ydCB7IGNvbW1vbkZ1bmN0aW9ucyB9IGZyb20gJy4uL2NvcmUvdmlldy1jb21tb24nO1xuXG5zZXRWaWV3RnVuY3Rpb24oXG4gIEFjdGlvbkJhcixcbiAgY29tbW9uRnVuY3Rpb25zLmFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkLFxuICBwcm9maWxlKCdBY3Rpb25CYXI8QTExWT4uYWNjZXNzaWJpbGl0eVNjcmVlbkNoYW5nZWQnLCBmdW5jdGlvbiBhY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCh0aGlzOiBBY3Rpb25CYXIpIHtcbiAgICBjb25zdCBhbmRyb2lkVmlldyA9IGdldEFuZHJvaWRWaWV3PGFuZHJvaWR4LmFwcGNvbXBhdC53aWRnZXQuVG9vbGJhcj4odGhpcyk7XG4gICAgaWYgKCFhbmRyb2lkVmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdhc0ZvY3VzYWJsZSA9IGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IDI2ICYmIGFuZHJvaWRWaWV3LmdldEZvY3VzYWJsZSgpO1xuICAgIGNvbnN0IGhhc0hlYWRpbmcgPSBhbmRyb2lkLm9zLkJ1aWxkLlZFUlNJT04uU0RLX0lOVCA+PSAyOCAmJiBhbmRyb2lkVmlldy5pc0FjY2Vzc2liaWxpdHlIZWFkaW5nKCk7XG4gICAgY29uc3QgaW1wb3J0YW50Rm9yQTExWSA9IGFuZHJvaWRWaWV3LmdldEltcG9ydGFudEZvckFjY2Vzc2liaWxpdHkoKTtcblxuICAgIHRyeSB7XG4gICAgICBhbmRyb2lkVmlldy5zZXRGb2N1c2FibGUoZmFsc2UpO1xuICAgICAgYW5kcm9pZFZpZXcuc2V0SW1wb3J0YW50Rm9yQWNjZXNzaWJpbGl0eShhbmRyb2lkLnZpZXcuVmlldy5JTVBPUlRBTlRfRk9SX0FDQ0VTU0lCSUxJVFlfTk8pO1xuXG4gICAgICBsZXQgYW5ub3VuY2VWaWV3OiBhbmRyb2lkLnZpZXcuVmlldyB8IG51bGwgPSBudWxsO1xuXG4gICAgICBjb25zdCBudW1DaGlsZHJlbiA9IGFuZHJvaWRWaWV3LmdldENoaWxkQ291bnQoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ2hpbGRyZW47IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjaGlsZFZpZXcgPSBhbmRyb2lkVmlldy5nZXRDaGlsZEF0KGkpO1xuICAgICAgICBpZiAoIWNoaWxkVmlldykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGRWaWV3LnNldEZvY3VzYWJsZSh0cnVlKTtcbiAgICAgICAgaWYgKGNoaWxkVmlldyBpbnN0YW5jZW9mIGFuZHJvaWR4LmFwcGNvbXBhdC53aWRnZXQuQXBwQ29tcGF0VGV4dFZpZXcpIHtcbiAgICAgICAgICBhbm5vdW5jZVZpZXcgPSBjaGlsZFZpZXc7XG4gICAgICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IDI4KSB7XG4gICAgICAgICAgICBhbm5vdW5jZVZpZXcuc2V0QWNjZXNzaWJpbGl0eUhlYWRpbmcodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghYW5ub3VuY2VWaWV3KSB7XG4gICAgICAgIGFubm91bmNlVmlldyA9IGFuZHJvaWRWaWV3O1xuICAgICAgfVxuXG4gICAgICBhbm5vdW5jZVZpZXcuc2V0Rm9jdXNhYmxlKHRydWUpO1xuICAgICAgYW5ub3VuY2VWaWV3LnNldEltcG9ydGFudEZvckFjY2Vzc2liaWxpdHkoYW5kcm9pZC52aWV3LlZpZXcuSU1QT1JUQU5UX0ZPUl9BQ0NFU1NJQklMSVRZX1lFUyk7XG5cbiAgICAgIGFubm91bmNlVmlldy5zZW5kQWNjZXNzaWJpbGl0eUV2ZW50KGFuZHJvaWQudmlldy5hY2Nlc3NpYmlsaXR5LkFjY2Vzc2liaWxpdHlFdmVudC5UWVBFX1ZJRVdfRk9DVVNFRCk7XG4gICAgICBhbm5vdW5jZVZpZXcuc2VuZEFjY2Vzc2liaWxpdHlFdmVudChhbmRyb2lkLnZpZXcuYWNjZXNzaWJpbGl0eS5BY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9WSUVXX0FDQ0VTU0lCSUxJVFlfRk9DVVNFRCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2FsQW5kcm9pZFZpZXcgPSBnZXRBbmRyb2lkVmlldyh0aGlzKTtcbiAgICAgICAgaWYgKCFsb2NhbEFuZHJvaWRWaWV3KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IDI4KSB7XG4gICAgICAgICAgYW5kcm9pZFZpZXcuc2V0QWNjZXNzaWJpbGl0eUhlYWRpbmcoaGFzSGVhZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gMjYpIHtcbiAgICAgICAgICBsb2NhbEFuZHJvaWRWaWV3LnNldEZvY3VzYWJsZSh3YXNGb2N1c2FibGUpO1xuICAgICAgICB9XG4gICAgICAgIGxvY2FsQW5kcm9pZFZpZXcuc2V0SW1wb3J0YW50Rm9yQWNjZXNzaWJpbGl0eShpbXBvcnRhbnRGb3JBMTFZKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSksXG4pO1xuXG5mb3IgKGNvbnN0IGZuTmFtZSBvZiBbJ3VwZGF0ZScsICdfb25UaXRsZVByb3BlcnR5Q2hhbmdlZCddKSB7XG4gIHdyYXBGdW5jdGlvbihcbiAgICBBY3Rpb25CYXIucHJvdG90eXBlLFxuICAgIGZuTmFtZSxcbiAgICBmdW5jdGlvbih0aGlzOiBBY3Rpb25CYXIpIHtcbiAgICAgIEFjY2Vzc2liaWxpdHlIZWxwZXIudXBkYXRlQ29udGVudERlc2NyaXB0aW9uKHRoaXMsIHRydWUpO1xuICAgIH0sXG4gICAgJ0FjdGlvbkJhcicsXG4gICk7XG59XG4iXX0=