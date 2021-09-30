"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@nativescript/core/ui/action-bar/action-bar"));
var action_bar_1 = require("@nativescript/core/ui/action-bar/action-bar");
var trace_1 = require("../../trace");
var utils_1 = require("../../utils");
var AccessibilityHelper_1 = require("../../utils/AccessibilityHelper");
var view_common_1 = require("../core/view-common");
function updateA11YProperty(tnsView, propName, value) {
    value = value != null ? "" + value : null;
    var cls = "ActionBar<" + tnsView + ".ios>." + propName + " = " + value;
    var uiView = AccessibilityHelper_1.getUIView(tnsView);
    if (!uiView) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - no nativeView");
        }
        return;
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeTrace("" + cls);
    }
    uiView[propName] = value;
    if (!tnsView.page) {
        return;
    }
    var pageNativeView = tnsView.page.ios;
    if (!pageNativeView || !pageNativeView.navigationItem) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - no page nativeView");
        }
        return;
    }
    pageNativeView.navigationItem[propName] = value;
}
action_bar_1.ActionBar.prototype[view_common_1.accessibilityLabelProperty.setNative] = function accessibilityLabelSetNative(label) {
    if (this.title && label != null) {
        label = this.title + ". " + label;
    }
    updateA11YProperty(this, 'accessibilityLabel', label);
};
action_bar_1.ActionBar.prototype[view_common_1.accessibilityValueProperty.setNative] = function accessibilityValueSetNative(value) {
    updateA11YProperty(this, 'accessibilityValue', value);
};
action_bar_1.ActionBar.prototype[view_common_1.accessibilityHintProperty.setNative] = function accessibilityHintSetNative(hint) {
    updateA11YProperty(this, 'accessibilityValue', hint);
};
action_bar_1.ActionBar.prototype[view_common_1.accessibilityLanguageProperty.setNative] = function accessibilityLanguageSetNative(lang) {
    updateA11YProperty(this, 'accessibilityLanguage', lang);
};
utils_1.wrapFunction(action_bar_1.ActionBar.prototype, 'update', function customUpdate() {
    var e_1, _a;
    try {
        for (var _b = __values(['accessibilityLabel', 'accessibilityValue', 'accessibilityLanguage', 'accessibilityValue']), _c = _b.next(); !_c.done; _c = _b.next()) {
            var propName = _c.value;
            updateA11YProperty(this, propName, this[propName]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}, 'ActionBar');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWJhci5pb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY3Rpb24tYmFyLmlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlFQUE0RDtBQUM1RCwwRUFBd0U7QUFDeEUscUNBQXlEO0FBQ3pELHFDQUEyQztBQUMzQyx1RUFBNEQ7QUFDNUQsbURBQXVKO0FBRXZKLFNBQVMsa0JBQWtCLENBQUMsT0FBa0IsRUFBRSxRQUFnQixFQUFFLEtBQWdDO0lBQ2hHLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFHLEtBQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzFDLElBQU0sR0FBRyxHQUFHLGVBQWEsT0FBTyxjQUFTLFFBQVEsV0FBTSxLQUFPLENBQUM7SUFDL0QsSUFBTSxNQUFNLEdBQUcsK0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLHFCQUFrQixDQUFDLENBQUM7U0FDdEM7UUFFRCxPQUFPO0tBQ1I7SUFFRCxJQUFJLHNCQUFjLEVBQUUsRUFBRTtRQUNwQixrQkFBVSxDQUFDLEtBQUcsR0FBSyxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2pCLE9BQU87S0FDUjtJQUVELElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBdUIsQ0FBQztJQUM1RCxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRTtRQUNyRCxJQUFJLHNCQUFjLEVBQUUsRUFBRTtZQUNwQixrQkFBVSxDQUFJLEdBQUcsMEJBQXVCLENBQUMsQ0FBQztTQUMzQztRQUVELE9BQU87S0FDUjtJQUVELGNBQWMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ2xELENBQUM7QUFFRCxzQkFBUyxDQUFDLFNBQVMsQ0FBQyx3Q0FBMEIsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLDJCQUEyQixDQUFrQixLQUFvQjtJQUNwSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUMvQixLQUFLLEdBQU0sSUFBSSxDQUFDLEtBQUssVUFBSyxLQUFPLENBQUM7S0FDbkM7SUFFRCxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBRUYsc0JBQVMsQ0FBQyxTQUFTLENBQUMsd0NBQTBCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUywyQkFBMkIsQ0FBa0IsS0FBYTtJQUM3SCxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBRUYsc0JBQVMsQ0FBQyxTQUFTLENBQUMsdUNBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUywwQkFBMEIsQ0FBa0IsSUFBWTtJQUMxSCxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkQsQ0FBQyxDQUFDO0FBRUYsc0JBQVMsQ0FBQyxTQUFTLENBQUMsMkNBQTZCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyw4QkFBOEIsQ0FBa0IsSUFBWTtJQUNsSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUQsQ0FBQyxDQUFDO0FBRUYsb0JBQVksQ0FDVixzQkFBUyxDQUFDLFNBQVMsRUFDbkIsUUFBUSxFQUNSLFNBQVMsWUFBWTs7O1FBQ25CLEtBQXVCLElBQUEsS0FBQSxTQUFBLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtZQUEvRyxJQUFNLFFBQVEsV0FBQTtZQUNqQixrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3BEOzs7Ozs7Ozs7QUFDSCxDQUFDLEVBQ0QsV0FBVyxDQUNaLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvYWN0aW9uLWJhci9hY3Rpb24tYmFyJztcbmltcG9ydCB7IEFjdGlvbkJhciB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9hY3Rpb24tYmFyL2FjdGlvbi1iYXInO1xuaW1wb3J0IHsgaXNUcmFjZUVuYWJsZWQsIHdyaXRlVHJhY2UgfSBmcm9tICcuLi8uLi90cmFjZSc7XG5pbXBvcnQgeyB3cmFwRnVuY3Rpb24gfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBnZXRVSVZpZXcgfSBmcm9tICcuLi8uLi91dGlscy9BY2Nlc3NpYmlsaXR5SGVscGVyJztcbmltcG9ydCB7IGFjY2Vzc2liaWxpdHlIaW50UHJvcGVydHksIGFjY2Vzc2liaWxpdHlMYWJlbFByb3BlcnR5LCBhY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VQcm9wZXJ0eSwgYWNjZXNzaWJpbGl0eVZhbHVlUHJvcGVydHkgfSBmcm9tICcuLi9jb3JlL3ZpZXctY29tbW9uJztcblxuZnVuY3Rpb24gdXBkYXRlQTExWVByb3BlcnR5KHRuc1ZpZXc6IEFjdGlvbkJhciwgcHJvcE5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgdmFsdWUgPSB2YWx1ZSAhPSBudWxsID8gYCR7dmFsdWV9YCA6IG51bGw7XG4gIGNvbnN0IGNscyA9IGBBY3Rpb25CYXI8JHt0bnNWaWV3fS5pb3M+LiR7cHJvcE5hbWV9ID0gJHt2YWx1ZX1gO1xuICBjb25zdCB1aVZpZXcgPSBnZXRVSVZpZXcodG5zVmlldyk7XG4gIGlmICghdWlWaWV3KSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIG5vIG5hdGl2ZVZpZXdgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgIHdyaXRlVHJhY2UoYCR7Y2xzfWApO1xuICB9XG5cbiAgdWlWaWV3W3Byb3BOYW1lXSA9IHZhbHVlO1xuICBpZiAoIXRuc1ZpZXcucGFnZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhZ2VOYXRpdmVWaWV3ID0gdG5zVmlldy5wYWdlLmlvcyBhcyBVSVZpZXdDb250cm9sbGVyO1xuICBpZiAoIXBhZ2VOYXRpdmVWaWV3IHx8ICFwYWdlTmF0aXZlVmlldy5uYXZpZ2F0aW9uSXRlbSkge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZVRyYWNlKGAke2Nsc30gLSBubyBwYWdlIG5hdGl2ZVZpZXdgKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBwYWdlTmF0aXZlVmlldy5uYXZpZ2F0aW9uSXRlbVtwcm9wTmFtZV0gPSB2YWx1ZTtcbn1cblxuQWN0aW9uQmFyLnByb3RvdHlwZVthY2Nlc3NpYmlsaXR5TGFiZWxQcm9wZXJ0eS5zZXROYXRpdmVdID0gZnVuY3Rpb24gYWNjZXNzaWJpbGl0eUxhYmVsU2V0TmF0aXZlKHRoaXM6IEFjdGlvbkJhciwgbGFiZWw6IHN0cmluZyB8IG51bGwpIHtcbiAgaWYgKHRoaXMudGl0bGUgJiYgbGFiZWwgIT0gbnVsbCkge1xuICAgIGxhYmVsID0gYCR7dGhpcy50aXRsZX0uICR7bGFiZWx9YDtcbiAgfVxuXG4gIHVwZGF0ZUExMVlQcm9wZXJ0eSh0aGlzLCAnYWNjZXNzaWJpbGl0eUxhYmVsJywgbGFiZWwpO1xufTtcblxuQWN0aW9uQmFyLnByb3RvdHlwZVthY2Nlc3NpYmlsaXR5VmFsdWVQcm9wZXJ0eS5zZXROYXRpdmVdID0gZnVuY3Rpb24gYWNjZXNzaWJpbGl0eVZhbHVlU2V0TmF0aXZlKHRoaXM6IEFjdGlvbkJhciwgdmFsdWU6IHN0cmluZykge1xuICB1cGRhdGVBMTFZUHJvcGVydHkodGhpcywgJ2FjY2Vzc2liaWxpdHlWYWx1ZScsIHZhbHVlKTtcbn07XG5cbkFjdGlvbkJhci5wcm90b3R5cGVbYWNjZXNzaWJpbGl0eUhpbnRQcm9wZXJ0eS5zZXROYXRpdmVdID0gZnVuY3Rpb24gYWNjZXNzaWJpbGl0eUhpbnRTZXROYXRpdmUodGhpczogQWN0aW9uQmFyLCBoaW50OiBzdHJpbmcpIHtcbiAgdXBkYXRlQTExWVByb3BlcnR5KHRoaXMsICdhY2Nlc3NpYmlsaXR5VmFsdWUnLCBoaW50KTtcbn07XG5cbkFjdGlvbkJhci5wcm90b3R5cGVbYWNjZXNzaWJpbGl0eUxhbmd1YWdlUHJvcGVydHkuc2V0TmF0aXZlXSA9IGZ1bmN0aW9uIGFjY2Vzc2liaWxpdHlMYW5ndWFnZVNldE5hdGl2ZSh0aGlzOiBBY3Rpb25CYXIsIGxhbmc6IHN0cmluZykge1xuICB1cGRhdGVBMTFZUHJvcGVydHkodGhpcywgJ2FjY2Vzc2liaWxpdHlMYW5ndWFnZScsIGxhbmcpO1xufTtcblxud3JhcEZ1bmN0aW9uKFxuICBBY3Rpb25CYXIucHJvdG90eXBlLFxuICAndXBkYXRlJyxcbiAgZnVuY3Rpb24gY3VzdG9tVXBkYXRlKCkge1xuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgb2YgWydhY2Nlc3NpYmlsaXR5TGFiZWwnLCAnYWNjZXNzaWJpbGl0eVZhbHVlJywgJ2FjY2Vzc2liaWxpdHlMYW5ndWFnZScsICdhY2Nlc3NpYmlsaXR5VmFsdWUnXSkge1xuICAgICAgdXBkYXRlQTExWVByb3BlcnR5KHRoaXMsIHByb3BOYW1lLCB0aGlzW3Byb3BOYW1lXSk7XG4gICAgfVxuICB9LFxuICAnQWN0aW9uQmFyJyxcbik7XG4iXX0=