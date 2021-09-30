"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./page-common"));
var profiling_1 = require("@nativescript/core/profiling");
var page_1 = require("@nativescript/core/ui/page/page");
var trace_1 = require("../../trace");
var utils_1 = require("../../utils");
var AccessibilityHelper_1 = require("../../utils/AccessibilityHelper");
var view_common_1 = require("../core/view-common");
utils_1.setViewFunction(page_1.Page, view_common_1.commonFunctions.accessibilityScreenChanged, profiling_1.profile('Page<A11Y>.accessibilityScreenChanged', function accessibilityScreenChanged(refocus) {
    if (refocus === void 0) { refocus = false; }
    var cls = this + "." + view_common_1.commonFunctions.accessibilityScreenChanged + "(" + refocus + ")";
    if (refocus) {
        var lastFocusedView = utils_1.getLastFocusedViewOnPage(this);
        if (lastFocusedView) {
            if (trace_1.isTraceEnabled()) {
                trace_1.writeTrace(cls + " - refocus on " + lastFocusedView);
            }
            var announceView = AccessibilityHelper_1.getAndroidView(lastFocusedView);
            if (announceView) {
                announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_FOCUSED);
                announceView.sendAccessibilityEvent(android.view.accessibility.AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED);
                return;
            }
        }
    }
    if (this.actionBarHidden) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - action-bar hidden");
        }
        this.androidSendAccessibilityEvent('window_state_changed');
        return;
    }
    if (this.accessibilityLabel) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - page has an accessibilityLabel: " + this.accessibilityLabel);
        }
        this.androidSendAccessibilityEvent('window_state_changed');
        return;
    }
    if (this.actionBar.accessibilityLabel || this.actionBar.title) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " action-bar has an accessibilityLabel=\"" + this.actionBar.accessibilityLabel + "\" or a title=\"" + this.actionBar.title + "\"");
        }
        this.actionBar.accessibilityScreenChanged();
        return;
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeTrace(cls + " - action-bar doesn't have an accessibilityLabel or a title");
    }
    this.androidSendAccessibilityEvent('window_state_changed');
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5hbmRyb2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFnZS5hbmRyb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQThCO0FBQzlCLDBEQUF1RDtBQUN2RCx3REFBdUQ7QUFDdkQscUNBQXlEO0FBQ3pELHFDQUF3RTtBQUN4RSx1RUFBaUU7QUFDakUsbURBQXNEO0FBRXRELHVCQUFlLENBQ2IsV0FBSSxFQUNKLDZCQUFlLENBQUMsMEJBQTBCLEVBQzFDLG1CQUFPLENBQUMsdUNBQXVDLEVBQUUsU0FBUywwQkFBMEIsQ0FBYSxPQUFlO0lBQWYsd0JBQUEsRUFBQSxlQUFlO0lBQzlHLElBQU0sR0FBRyxHQUFNLElBQUksU0FBSSw2QkFBZSxDQUFDLDBCQUEwQixTQUFJLE9BQU8sTUFBRyxDQUFDO0lBRWhGLElBQUksT0FBTyxFQUFFO1FBQ1gsSUFBTSxlQUFlLEdBQUcsZ0NBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxlQUFlLEVBQUU7WUFDbkIsSUFBSSxzQkFBYyxFQUFFLEVBQUU7Z0JBQ3BCLGtCQUFVLENBQUksR0FBRyxzQkFBaUIsZUFBaUIsQ0FBQyxDQUFDO2FBQ3REO1lBRUQsSUFBTSxZQUFZLEdBQUcsb0NBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNyRCxJQUFJLFlBQVksRUFBRTtnQkFDaEIsWUFBWSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3JHLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUVuSCxPQUFPO2FBQ1I7U0FDRjtLQUNGO0lBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksc0JBQWMsRUFBRSxFQUFFO1lBQ3BCLGtCQUFVLENBQUksR0FBRyx5QkFBc0IsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxDQUFDLDZCQUE2QixDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFM0QsT0FBTztLQUNSO0lBRUQsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLDJDQUFzQyxJQUFJLENBQUMsa0JBQW9CLENBQUMsQ0FBQztTQUNuRjtRQUVELElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRTNELE9BQU87S0FDUjtJQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtRQUM3RCxJQUFJLHNCQUFjLEVBQUUsRUFBRTtZQUNwQixrQkFBVSxDQUFJLEdBQUcsZ0RBQTBDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLHdCQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBRyxDQUFDLENBQUM7U0FDdkk7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFFNUMsT0FBTztLQUNSO0lBRUQsSUFBSSxzQkFBYyxFQUFFLEVBQUU7UUFDcEIsa0JBQVUsQ0FBSSxHQUFHLGdFQUE2RCxDQUFDLENBQUM7S0FDakY7SUFFRCxJQUFJLENBQUMsNkJBQTZCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUMsQ0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9wYWdlLWNvbW1vbic7XG5pbXBvcnQgeyBwcm9maWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3Byb2ZpbGluZyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3BhZ2UvcGFnZSc7XG5pbXBvcnQgeyBpc1RyYWNlRW5hYmxlZCwgd3JpdGVUcmFjZSB9IGZyb20gJy4uLy4uL3RyYWNlJztcbmltcG9ydCB7IGdldExhc3RGb2N1c2VkVmlld09uUGFnZSwgc2V0Vmlld0Z1bmN0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0QW5kcm9pZFZpZXcgfSBmcm9tICcuLi8uLi91dGlscy9BY2Nlc3NpYmlsaXR5SGVscGVyJztcbmltcG9ydCB7IGNvbW1vbkZ1bmN0aW9ucyB9IGZyb20gJy4uL2NvcmUvdmlldy1jb21tb24nO1xuXG5zZXRWaWV3RnVuY3Rpb24oXG4gIFBhZ2UsXG4gIGNvbW1vbkZ1bmN0aW9ucy5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCxcbiAgcHJvZmlsZSgnUGFnZTxBMTFZPi5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCcsIGZ1bmN0aW9uIGFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkKHRoaXM6IFBhZ2UsIHJlZm9jdXMgPSBmYWxzZSkge1xuICAgIGNvbnN0IGNscyA9IGAke3RoaXN9LiR7Y29tbW9uRnVuY3Rpb25zLmFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkfSgke3JlZm9jdXN9KWA7XG5cbiAgICBpZiAocmVmb2N1cykge1xuICAgICAgY29uc3QgbGFzdEZvY3VzZWRWaWV3ID0gZ2V0TGFzdEZvY3VzZWRWaWV3T25QYWdlKHRoaXMpO1xuICAgICAgaWYgKGxhc3RGb2N1c2VkVmlldykge1xuICAgICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIHJlZm9jdXMgb24gJHtsYXN0Rm9jdXNlZFZpZXd9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbm5vdW5jZVZpZXcgPSBnZXRBbmRyb2lkVmlldyhsYXN0Rm9jdXNlZFZpZXcpO1xuICAgICAgICBpZiAoYW5ub3VuY2VWaWV3KSB7XG4gICAgICAgICAgYW5ub3VuY2VWaWV3LnNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoYW5kcm9pZC52aWV3LmFjY2Vzc2liaWxpdHkuQWNjZXNzaWJpbGl0eUV2ZW50LlRZUEVfVklFV19GT0NVU0VEKTtcbiAgICAgICAgICBhbm5vdW5jZVZpZXcuc2VuZEFjY2Vzc2liaWxpdHlFdmVudChhbmRyb2lkLnZpZXcuYWNjZXNzaWJpbGl0eS5BY2Nlc3NpYmlsaXR5RXZlbnQuVFlQRV9WSUVXX0FDQ0VTU0lCSUxJVFlfRk9DVVNFRCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3Rpb25CYXJIaWRkZW4pIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIGFjdGlvbi1iYXIgaGlkZGVuYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYW5kcm9pZFNlbmRBY2Nlc3NpYmlsaXR5RXZlbnQoJ3dpbmRvd19zdGF0ZV9jaGFuZ2VkJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY2Nlc3NpYmlsaXR5TGFiZWwpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIHBhZ2UgaGFzIGFuIGFjY2Vzc2liaWxpdHlMYWJlbDogJHt0aGlzLmFjY2Vzc2liaWxpdHlMYWJlbH1gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hbmRyb2lkU2VuZEFjY2Vzc2liaWxpdHlFdmVudCgnd2luZG93X3N0YXRlX2NoYW5nZWQnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGlvbkJhci5hY2Nlc3NpYmlsaXR5TGFiZWwgfHwgdGhpcy5hY3Rpb25CYXIudGl0bGUpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSBhY3Rpb24tYmFyIGhhcyBhbiBhY2Nlc3NpYmlsaXR5TGFiZWw9XCIke3RoaXMuYWN0aW9uQmFyLmFjY2Vzc2liaWxpdHlMYWJlbH1cIiBvciBhIHRpdGxlPVwiJHt0aGlzLmFjdGlvbkJhci50aXRsZX1cImApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFjdGlvbkJhci5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIGFjdGlvbi1iYXIgZG9lc24ndCBoYXZlIGFuIGFjY2Vzc2liaWxpdHlMYWJlbCBvciBhIHRpdGxlYCk7XG4gICAgfVxuXG4gICAgdGhpcy5hbmRyb2lkU2VuZEFjY2Vzc2liaWxpdHlFdmVudCgnd2luZG93X3N0YXRlX2NoYW5nZWQnKTtcbiAgfSksXG4pO1xuIl19