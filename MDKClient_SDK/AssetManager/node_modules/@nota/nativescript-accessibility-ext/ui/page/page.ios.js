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
    var cls = this + "." + view_common_1.commonFunctions.accessibilityScreenChanged;
    if (refocus) {
        var lastFocusedView = utils_1.getLastFocusedViewOnPage(this);
        if (lastFocusedView) {
            if (trace_1.isTraceEnabled()) {
                trace_1.writeTrace(cls + " - refocus on " + lastFocusedView);
            }
            var uiView = AccessibilityHelper_1.getUIView(lastFocusedView);
            if (uiView) {
                UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, uiView);
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
    if (this.actionBarHidden) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - action-bar hidden");
        }
        UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, AccessibilityHelper_1.getUIView(this));
        return;
    }
    if (this.accessibilityLabel) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - page has an accessibilityLabel: " + this.accessibilityLabel);
        }
        UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, AccessibilityHelper_1.getUIView(this));
        return;
    }
    if (this.actionBar.accessibilityLabel || this.actionBar.title) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " action-bar has an accessibilityLabel=\"" + this.actionBar.accessibilityLabel + "\" or a title=\"" + this.actionBar.title + "\"");
        }
        UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, this.actionBar.nativeView);
        return;
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeTrace(cls + " - action-bar doesn't have an accessibilityLabel or a title");
    }
    UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, AccessibilityHelper_1.getUIView(this));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5pb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYWdlLmlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUE4QjtBQUU5QiwwREFBdUQ7QUFDdkQsd0RBQXVEO0FBQ3ZELHFDQUF5RDtBQUN6RCxxQ0FBd0U7QUFDeEUsdUVBQTREO0FBQzVELG1EQUFzRDtBQUV0RCx1QkFBZSxDQUNiLFdBQUksRUFDSiw2QkFBZSxDQUFDLDBCQUEwQixFQUMxQyxtQkFBTyxDQUFDLHVDQUF1QyxFQUFFLFNBQVMsMEJBQTBCLENBQWEsT0FBZTtJQUFmLHdCQUFBLEVBQUEsZUFBZTtJQUM5RyxJQUFNLEdBQUcsR0FBTSxJQUFJLFNBQUksNkJBQWUsQ0FBQywwQkFBNEIsQ0FBQztJQUVwRSxJQUFJLE9BQU8sRUFBRTtRQUNYLElBQU0sZUFBZSxHQUFHLGdDQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksZUFBZSxFQUFFO1lBQ25CLElBQUksc0JBQWMsRUFBRSxFQUFFO2dCQUNwQixrQkFBVSxDQUFJLEdBQUcsc0JBQWlCLGVBQWlCLENBQUMsQ0FBQzthQUN0RDtZQUVELElBQU0sTUFBTSxHQUFHLCtCQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDMUMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsK0JBQStCLENBQUMsd0NBQXdDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWxGLE9BQU87YUFDUjtTQUNGO0tBQ0Y7SUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLHlCQUFzQixDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLENBQUMsNkJBQTZCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPO0tBQ1I7SUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLHlCQUFzQixDQUFDLENBQUM7U0FDMUM7UUFFRCwrQkFBK0IsQ0FBQyx3Q0FBd0MsRUFBRSwrQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0YsT0FBTztLQUNSO0lBRUQsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLDJDQUFzQyxJQUFJLENBQUMsa0JBQW9CLENBQUMsQ0FBQztTQUNuRjtRQUVELCtCQUErQixDQUFDLHdDQUF3QyxFQUFFLCtCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUzRixPQUFPO0tBQ1I7SUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDN0QsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLGdEQUEwQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQix3QkFBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLE9BQUcsQ0FBQyxDQUFDO1NBQ3ZJO1FBRUQsK0JBQStCLENBQUMsd0NBQXdDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRyxPQUFPO0tBQ1I7SUFFRCxJQUFJLHNCQUFjLEVBQUUsRUFBRTtRQUNwQixrQkFBVSxDQUFJLEdBQUcsZ0VBQTZELENBQUMsQ0FBQztLQUNqRjtJQUVELCtCQUErQixDQUFDLHdDQUF3QyxFQUFFLCtCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3RixDQUFDLENBQUMsQ0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9wYWdlLWNvbW1vbic7XG5cbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvcGFnZS9wYWdlJztcbmltcG9ydCB7IGlzVHJhY2VFbmFibGVkLCB3cml0ZVRyYWNlIH0gZnJvbSAnLi4vLi4vdHJhY2UnO1xuaW1wb3J0IHsgZ2V0TGFzdEZvY3VzZWRWaWV3T25QYWdlLCBzZXRWaWV3RnVuY3Rpb24gfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBnZXRVSVZpZXcgfSBmcm9tICcuLi8uLi91dGlscy9BY2Nlc3NpYmlsaXR5SGVscGVyJztcbmltcG9ydCB7IGNvbW1vbkZ1bmN0aW9ucyB9IGZyb20gJy4uL2NvcmUvdmlldy1jb21tb24nO1xuXG5zZXRWaWV3RnVuY3Rpb24oXG4gIFBhZ2UsXG4gIGNvbW1vbkZ1bmN0aW9ucy5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCxcbiAgcHJvZmlsZSgnUGFnZTxBMTFZPi5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCcsIGZ1bmN0aW9uIGFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkKHRoaXM6IFBhZ2UsIHJlZm9jdXMgPSBmYWxzZSkge1xuICAgIGNvbnN0IGNscyA9IGAke3RoaXN9LiR7Y29tbW9uRnVuY3Rpb25zLmFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkfWA7XG5cbiAgICBpZiAocmVmb2N1cykge1xuICAgICAgY29uc3QgbGFzdEZvY3VzZWRWaWV3ID0gZ2V0TGFzdEZvY3VzZWRWaWV3T25QYWdlKHRoaXMpO1xuICAgICAgaWYgKGxhc3RGb2N1c2VkVmlldykge1xuICAgICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIHJlZm9jdXMgb24gJHtsYXN0Rm9jdXNlZFZpZXd9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1aVZpZXcgPSBnZXRVSVZpZXcobGFzdEZvY3VzZWRWaWV3KTtcbiAgICAgICAgaWYgKHVpVmlldykge1xuICAgICAgICAgIFVJQWNjZXNzaWJpbGl0eVBvc3ROb3RpZmljYXRpb24oVUlBY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZE5vdGlmaWNhdGlvbiwgdWlWaWV3KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGlvbkJhckhpZGRlbikge1xuICAgICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgICAgd3JpdGVUcmFjZShgJHtjbHN9IC0gYWN0aW9uLWJhciBoaWRkZW5gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hbmRyb2lkU2VuZEFjY2Vzc2liaWxpdHlFdmVudCgnd2luZG93X3N0YXRlX2NoYW5nZWQnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGlvbkJhckhpZGRlbikge1xuICAgICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgICAgd3JpdGVUcmFjZShgJHtjbHN9IC0gYWN0aW9uLWJhciBoaWRkZW5gKTtcbiAgICAgIH1cblxuICAgICAgVUlBY2Nlc3NpYmlsaXR5UG9zdE5vdGlmaWNhdGlvbihVSUFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkTm90aWZpY2F0aW9uLCBnZXRVSVZpZXcodGhpcykpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWNjZXNzaWJpbGl0eUxhYmVsKSB7XG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZVRyYWNlKGAke2Nsc30gLSBwYWdlIGhhcyBhbiBhY2Nlc3NpYmlsaXR5TGFiZWw6ICR7dGhpcy5hY2Nlc3NpYmlsaXR5TGFiZWx9YCk7XG4gICAgICB9XG5cbiAgICAgIFVJQWNjZXNzaWJpbGl0eVBvc3ROb3RpZmljYXRpb24oVUlBY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZE5vdGlmaWNhdGlvbiwgZ2V0VUlWaWV3KHRoaXMpKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGlvbkJhci5hY2Nlc3NpYmlsaXR5TGFiZWwgfHwgdGhpcy5hY3Rpb25CYXIudGl0bGUpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSBhY3Rpb24tYmFyIGhhcyBhbiBhY2Nlc3NpYmlsaXR5TGFiZWw9XCIke3RoaXMuYWN0aW9uQmFyLmFjY2Vzc2liaWxpdHlMYWJlbH1cIiBvciBhIHRpdGxlPVwiJHt0aGlzLmFjdGlvbkJhci50aXRsZX1cImApO1xuICAgICAgfVxuXG4gICAgICBVSUFjY2Vzc2liaWxpdHlQb3N0Tm90aWZpY2F0aW9uKFVJQWNjZXNzaWJpbGl0eVNjcmVlbkNoYW5nZWROb3RpZmljYXRpb24sIHRoaXMuYWN0aW9uQmFyLm5hdGl2ZVZpZXcpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIGFjdGlvbi1iYXIgZG9lc24ndCBoYXZlIGFuIGFjY2Vzc2liaWxpdHlMYWJlbCBvciBhIHRpdGxlYCk7XG4gICAgfVxuXG4gICAgVUlBY2Nlc3NpYmlsaXR5UG9zdE5vdGlmaWNhdGlvbihVSUFjY2Vzc2liaWxpdHlTY3JlZW5DaGFuZ2VkTm90aWZpY2F0aW9uLCBnZXRVSVZpZXcodGhpcykpO1xuICB9KSxcbik7XG4iXX0=