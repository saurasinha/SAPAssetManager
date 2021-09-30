"use strict";
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("@nativescript/core/data/observable/observable");
var profiling_1 = require("@nativescript/core/profiling");
var action_bar_1 = require("@nativescript/core/ui/action-bar/action-bar");
var activity_indicator_1 = require("@nativescript/core/ui/activity-indicator/activity-indicator");
var button_1 = require("@nativescript/core/ui/button/button");
var view_1 = require("@nativescript/core/ui/core/view/view");
var date_picker_1 = require("@nativescript/core/ui/date-picker/date-picker");
var editable_text_base_1 = require("@nativescript/core/ui/editable-text-base/editable-text-base");
var frame_1 = require("@nativescript/core/ui/frame/frame");
var html_view_1 = require("@nativescript/core/ui/html-view/html-view");
var image_1 = require("@nativescript/core/ui/image/image");
var label_1 = require("@nativescript/core/ui/label");
var absolute_layout_1 = require("@nativescript/core/ui/layouts/absolute-layout/absolute-layout");
var dock_layout_1 = require("@nativescript/core/ui/layouts/dock-layout/dock-layout");
var flexbox_layout_1 = require("@nativescript/core/ui/layouts/flexbox-layout/flexbox-layout");
var grid_layout_1 = require("@nativescript/core/ui/layouts/grid-layout/grid-layout");
var layout_base_1 = require("@nativescript/core/ui/layouts/layout-base");
var stack_layout_1 = require("@nativescript/core/ui/layouts/stack-layout/stack-layout");
var wrap_layout_1 = require("@nativescript/core/ui/layouts/wrap-layout/wrap-layout");
var list_picker_1 = require("@nativescript/core/ui/list-picker/list-picker");
var list_view_1 = require("@nativescript/core/ui/list-view/list-view");
var page_1 = require("@nativescript/core/ui/page/page");
var placeholder_1 = require("@nativescript/core/ui/placeholder/placeholder");
var progress_1 = require("@nativescript/core/ui/progress/progress");
var repeater_1 = require("@nativescript/core/ui/repeater/repeater");
var scroll_view_1 = require("@nativescript/core/ui/scroll-view/scroll-view");
var search_bar_1 = require("@nativescript/core/ui/search-bar/search-bar");
var segmented_bar_1 = require("@nativescript/core/ui/segmented-bar/segmented-bar");
var slider_1 = require("@nativescript/core/ui/slider/slider");
var switch_1 = require("@nativescript/core/ui/switch/switch");
var tab_view_1 = require("@nativescript/core/ui/tab-view/tab-view");
var text_base_1 = require("@nativescript/core/ui/text-base/text-base");
var text_field_1 = require("@nativescript/core/ui/text-field/text-field");
var text_view_1 = require("@nativescript/core/ui/text-view/text-view");
var time_picker_1 = require("@nativescript/core/ui/time-picker/time-picker");
var web_view_1 = require("@nativescript/core/ui/web-view/web-view");
var trace_1 = require("../trace");
var view_common_1 = require("../ui/core/view-common");
var helpers_1 = require("./helpers");
function setupGlobalEventsOnViewClass(ViewClass, viewName) {
    var obsKeyName = "__a11y_globalEvent_" + viewName + "_observable";
    if (ViewClass[obsKeyName]) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeGlobalEventsTrace("\"" + viewName + "\" already overridden");
        }
        return;
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeGlobalEventsTrace("Adding to \"" + viewName + "\"");
    }
    ViewClass[obsKeyName] = new observable_1.Observable();
    helpers_1.unwrapFunction(ViewClass.prototype, 'notify', viewName);
    helpers_1.wrapFunction(ViewClass.prototype, 'notify', profiling_1.profile(viewName + "<A11Y>.customNotify", function customNotify(arg) {
        if (!ViewClass[obsKeyName].hasListeners(arg.eventName)) {
            return;
        }
        if (trace_1.isTraceEnabled()) {
            trace_1.writeGlobalEventsTrace("Notify \"" + arg.eventName + "\" to all \"" + viewName + "\" from " + arg.object);
        }
        ViewClass[obsKeyName].notify(arg);
    }), viewName);
    ViewClass.on = ViewClass.addEventListener = function customAddEventListener(eventNames, callback, thisArg) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeGlobalEventsTrace("On: \"" + eventNames + "\" thisArg:" + thisArg + " to \"" + viewName + "\"");
        }
        ViewClass[obsKeyName].on(eventNames, callback, thisArg);
    };
    ViewClass.once = function customAddOnceEventListener(eventNames, callback, thisArg) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeGlobalEventsTrace("Once: \"" + eventNames + "\" thisArg:" + thisArg + " to \"" + viewName + "\"");
        }
        ViewClass[obsKeyName].once(eventNames, callback, thisArg);
    };
    ViewClass.off = ViewClass.removeEventListener = function customRemoveEventListener(eventNames, callback, thisArg) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeGlobalEventsTrace("Remove: \"" + eventNames + "\" this:" + thisArg + " from \"" + viewName + "\"");
        }
        ViewClass[obsKeyName].off(eventNames, callback, thisArg);
    };
}
exports.setupGlobalEventsOnViewClass = setupGlobalEventsOnViewClass;
setupGlobalEventsOnViewClass(view_common_1.ViewCommon, 'ViewCommon');
setupGlobalEventsOnViewClass(view_1.View, 'View');
setupGlobalEventsOnViewClass(text_base_1.TextBase, 'TextBase');
setupGlobalEventsOnViewClass(frame_1.ContainerView, 'ContainerView');
setupGlobalEventsOnViewClass(layout_base_1.LayoutBase, 'LayoutBase');
try {
    for (var _b = __values([
        { viewClass: absolute_layout_1.AbsoluteLayout, viewName: 'AbsoluteLayout' },
        { viewClass: action_bar_1.ActionBar, viewName: 'ActionBar' },
        { viewClass: activity_indicator_1.ActivityIndicator, viewName: 'ActivityIndicator' },
        { viewClass: button_1.Button, viewName: 'Button' },
        { viewClass: frame_1.CustomLayoutView, viewName: 'CustomLayoutView' },
        { viewClass: date_picker_1.DatePicker, viewName: 'DatePicker' },
        { viewClass: dock_layout_1.DockLayout, viewName: 'DockLayout' },
        { viewClass: editable_text_base_1.EditableTextBase, viewName: 'EditableTextBase' },
        { viewClass: flexbox_layout_1.FlexboxLayout, viewName: 'FlexboxLayout' },
        { viewClass: frame_1.Frame, viewName: 'Frame' },
        { viewClass: grid_layout_1.GridLayout, viewName: 'GridLayout' },
        { viewClass: html_view_1.HtmlView, viewName: 'HtmlView' },
        { viewClass: image_1.Image, viewName: 'Image' },
        { viewClass: label_1.Label, viewName: 'Label' },
        { viewClass: list_picker_1.ListPicker, viewName: 'ListPicker' },
        { viewClass: list_view_1.ListView, viewName: 'ListView' },
        { viewClass: page_1.Page, viewName: 'Page' },
        { viewClass: placeholder_1.Placeholder, viewName: 'Placeholder' },
        { viewClass: progress_1.Progress, viewName: 'Progress' },
        { viewClass: repeater_1.Repeater, viewName: 'Repeater' },
        { viewClass: scroll_view_1.ScrollView, viewName: 'ScrollView' },
        { viewClass: search_bar_1.SearchBar, viewName: 'SearchBar' },
        { viewClass: segmented_bar_1.SegmentedBar, viewName: 'SegmentedBar' },
        { viewClass: slider_1.Slider, viewName: 'Slider' },
        { viewClass: stack_layout_1.StackLayout, viewName: 'StackLayout' },
        { viewClass: switch_1.Switch, viewName: 'Switch' },
        { viewClass: tab_view_1.TabView, viewName: 'TabView' },
        { viewClass: text_field_1.TextField, viewName: 'TextField' },
        { viewClass: text_view_1.TextView, viewName: 'TextView' },
        { viewClass: time_picker_1.TimePicker, viewName: 'TimePicker' },
        { viewClass: web_view_1.WebView, viewName: 'WebView' },
        { viewClass: wrap_layout_1.WrapLayout, viewName: 'WrapLayout' },
    ]), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = _c.value, viewClass = _d.viewClass, viewName = _d.viewName;
        setupGlobalEventsOnViewClass(viewClass, viewName);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsb2JhbC1ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNEVBQXNGO0FBQ3RGLDBEQUF1RDtBQUN2RCwwRUFBd0U7QUFDeEUsa0dBQWdHO0FBQ2hHLDhEQUE2RDtBQUM3RCw2REFBNEQ7QUFDNUQsNkVBQTJFO0FBQzNFLGtHQUErRjtBQUMvRiwyREFBMkY7QUFDM0YsdUVBQXFFO0FBQ3JFLDJEQUEwRDtBQUMxRCxxREFBb0Q7QUFDcEQsaUdBQStGO0FBQy9GLHFGQUFtRjtBQUNuRiw4RkFBNEY7QUFDNUYscUZBQW1GO0FBQ25GLHlFQUF1RTtBQUN2RSx3RkFBc0Y7QUFDdEYscUZBQW1GO0FBQ25GLDZFQUEyRTtBQUMzRSx1RUFBcUU7QUFDckUsd0RBQXVEO0FBQ3ZELDZFQUE0RTtBQUM1RSxvRUFBbUU7QUFDbkUsb0VBQW1FO0FBQ25FLDZFQUEyRTtBQUMzRSwwRUFBd0U7QUFDeEUsbUZBQWlGO0FBQ2pGLDhEQUE2RDtBQUM3RCw4REFBNkQ7QUFDN0Qsb0VBQWtFO0FBQ2xFLHVFQUFxRTtBQUNyRSwwRUFBd0U7QUFDeEUsdUVBQXFFO0FBQ3JFLDZFQUEyRTtBQUMzRSxvRUFBa0U7QUFDbEUsa0NBQWtFO0FBQ2xFLHNEQUFvRDtBQUNwRCxxQ0FBeUQ7QUFFekQsU0FBZ0IsNEJBQTRCLENBQUMsU0FBYyxFQUFFLFFBQWdCO0lBQzNFLElBQU0sVUFBVSxHQUFHLHdCQUFzQixRQUFRLGdCQUFhLENBQUM7SUFFL0QsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDekIsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsOEJBQXNCLENBQUMsT0FBSSxRQUFRLDBCQUFzQixDQUFDLENBQUM7U0FDNUQ7UUFFRCxPQUFPO0tBQ1I7SUFFRCxJQUFJLHNCQUFjLEVBQUUsRUFBRTtRQUNwQiw4QkFBc0IsQ0FBQyxpQkFBYyxRQUFRLE9BQUcsQ0FBQyxDQUFD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QUFFLFNBQVMsRUFBRSxzQkFBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7UUFDL0MsRUFBRSxTQUFTLEVBQUUsNEJBQVksRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFO1FBQ3JELEVBQUUsU0FBUyxFQUFFLGVBQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO1FBQ3pDLEVBQUUsU0FBUyxFQUFFLDBCQUFXLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRTtRQUNuRCxFQUFFLFNBQVMsRUFBRSxlQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtRQUN6QyxFQUFFLFNBQVMsRUFBRSxrQkFBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUU7UUFDM0MsRUFBRSxTQUFTLEVBQUUsc0JBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFO1FBQy9DLEVBQUUsU0FBUyxFQUFFLG9CQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTtRQUM3QyxFQUFFLFNBQVMsRUFBRSx3QkFBVSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUU7UUFDakQsRUFBRSxTQUFTLEVBQUUsa0JBQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO1FBQzNDLEVBQUUsU0FBUyxFQUFFLHdCQUFVLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRTtLQUNsRCxDQUFBLGdCQUFBLDRCQUFFO1FBakNRLElBQUEsYUFBdUIsRUFBckIsd0JBQVMsRUFBRSxzQkFBUTtRQWtDOUIsNEJBQTRCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25EIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3VpL2NvcmUvdmlldy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgRXZlbnREYXRhLCBPYnNlcnZhYmxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL2RhdGEvb2JzZXJ2YWJsZS9vYnNlcnZhYmxlJztcbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IEFjdGlvbkJhciB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9hY3Rpb24tYmFyL2FjdGlvbi1iYXInO1xuaW1wb3J0IHsgQWN0aXZpdHlJbmRpY2F0b3IgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvYWN0aXZpdHktaW5kaWNhdG9yL2FjdGl2aXR5LWluZGljYXRvcic7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvYnV0dG9uL2J1dHRvbic7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2NvcmUvdmlldy92aWV3JztcbmltcG9ydCB7IERhdGVQaWNrZXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXInO1xuaW1wb3J0IHsgRWRpdGFibGVUZXh0QmFzZSB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9lZGl0YWJsZS10ZXh0LWJhc2UvZWRpdGFibGUtdGV4dC1iYXNlJztcbmltcG9ydCB7IENvbnRhaW5lclZpZXcsIEN1c3RvbUxheW91dFZpZXcsIEZyYW1lIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2ZyYW1lL2ZyYW1lJztcbmltcG9ydCB7IEh0bWxWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2h0bWwtdmlldy9odG1sLXZpZXcnO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvaW1hZ2UvaW1hZ2UnO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGFiZWwnO1xuaW1wb3J0IHsgQWJzb2x1dGVMYXlvdXQgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGF5b3V0cy9hYnNvbHV0ZS1sYXlvdXQvYWJzb2x1dGUtbGF5b3V0JztcbmltcG9ydCB7IERvY2tMYXlvdXQgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGF5b3V0cy9kb2NrLWxheW91dC9kb2NrLWxheW91dCc7XG5pbXBvcnQgeyBGbGV4Ym94TGF5b3V0IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2xheW91dHMvZmxleGJveC1sYXlvdXQvZmxleGJveC1sYXlvdXQnO1xuaW1wb3J0IHsgR3JpZExheW91dCB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9sYXlvdXRzL2dyaWQtbGF5b3V0L2dyaWQtbGF5b3V0JztcbmltcG9ydCB7IExheW91dEJhc2UgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGF5b3V0cy9sYXlvdXQtYmFzZSc7XG5pbXBvcnQgeyBTdGFja0xheW91dCB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9sYXlvdXRzL3N0YWNrLWxheW91dC9zdGFjay1sYXlvdXQnO1xuaW1wb3J0IHsgV3JhcExheW91dCB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9sYXlvdXRzL3dyYXAtbGF5b3V0L3dyYXAtbGF5b3V0JztcbmltcG9ydCB7IExpc3RQaWNrZXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGlzdC1waWNrZXIvbGlzdC1waWNrZXInO1xuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvbGlzdC12aWV3L2xpc3Qtdmlldyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3BhZ2UvcGFnZSc7XG5pbXBvcnQgeyBQbGFjZWhvbGRlciB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9wbGFjZWhvbGRlci9wbGFjZWhvbGRlcic7XG5pbXBvcnQgeyBQcm9ncmVzcyB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9wcm9ncmVzcy9wcm9ncmVzcyc7XG5pbXBvcnQgeyBSZXBlYXRlciB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9yZXBlYXRlci9yZXBlYXRlcic7XG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3Njcm9sbC12aWV3L3Njcm9sbC12aWV3JztcbmltcG9ydCB7IFNlYXJjaEJhciB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS9zZWFyY2gtYmFyL3NlYXJjaC1iYXInO1xuaW1wb3J0IHsgU2VnbWVudGVkQmFyIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3NlZ21lbnRlZC1iYXIvc2VnbWVudGVkLWJhcic7XG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvc2xpZGVyL3NsaWRlcic7XG5pbXBvcnQgeyBTd2l0Y2ggfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvc3dpdGNoL3N3aXRjaCc7XG5pbXBvcnQgeyBUYWJWaWV3IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3RhYi12aWV3L3RhYi12aWV3JztcbmltcG9ydCB7IFRleHRCYXNlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3RleHQtYmFzZS90ZXh0LWJhc2UnO1xuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3RleHQtZmllbGQvdGV4dC1maWVsZCc7XG5pbXBvcnQgeyBUZXh0VmlldyB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS90ZXh0LXZpZXcvdGV4dC12aWV3JztcbmltcG9ydCB7IFRpbWVQaWNrZXIgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvdGltZS1waWNrZXIvdGltZS1waWNrZXInO1xuaW1wb3J0IHsgV2ViVmlldyB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS91aS93ZWItdmlldy93ZWItdmlldyc7XG5pbXBvcnQgeyBpc1RyYWNlRW5hYmxlZCwgd3JpdGVHbG9iYWxFdmVudHNUcmFjZSB9IGZyb20gJy4uL3RyYWNlJztcbmltcG9ydCB7IFZpZXdDb21tb24gfSBmcm9tICcuLi91aS9jb3JlL3ZpZXctY29tbW9uJztcbmltcG9ydCB7IHVud3JhcEZ1bmN0aW9uLCB3cmFwRnVuY3Rpb24gfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBHbG9iYWxFdmVudHNPblZpZXdDbGFzcyhWaWV3Q2xhc3M6IGFueSwgdmlld05hbWU6IHN0cmluZykge1xuICBjb25zdCBvYnNLZXlOYW1lID0gYF9fYTExeV9nbG9iYWxFdmVudF8ke3ZpZXdOYW1lfV9vYnNlcnZhYmxlYDtcblxuICBpZiAoVmlld0NsYXNzW29ic0tleU5hbWVdKSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlR2xvYmFsRXZlbnRzVHJhY2UoYFwiJHt2aWV3TmFtZX1cIiBhbHJlYWR5IG92ZXJyaWRkZW5gKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgIHdyaXRlR2xvYmFsRXZlbnRzVHJhY2UoYEFkZGluZyB0byBcIiR7dmlld05hbWV9XCJgKTtcbiAgfVxuXG4gIFZpZXdDbGFzc1tvYnNLZXlOYW1lXSA9IG5ldyBPYnNlcnZhYmxlKCk7XG5cbiAgdW53cmFwRnVuY3Rpb24oVmlld0NsYXNzLnByb3RvdHlwZSwgJ25vdGlmeScsIHZpZXdOYW1lKTtcblxuICB3cmFwRnVuY3Rpb24oXG4gICAgVmlld0NsYXNzLnByb3RvdHlwZSxcbiAgICAnbm90aWZ5JyxcbiAgICBwcm9maWxlKGAke3ZpZXdOYW1lfTxBMTFZPi5jdXN0b21Ob3RpZnlgLCBmdW5jdGlvbiBjdXN0b21Ob3RpZnkoYXJnOiBFdmVudERhdGEpIHtcbiAgICAgIGlmICghVmlld0NsYXNzW29ic0tleU5hbWVdLmhhc0xpc3RlbmVycyhhcmcuZXZlbnROYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlR2xvYmFsRXZlbnRzVHJhY2UoYE5vdGlmeSBcIiR7YXJnLmV2ZW50TmFtZX1cIiB0byBhbGwgXCIke3ZpZXdOYW1lfVwiIGZyb20gJHthcmcub2JqZWN0fWApO1xuICAgICAgfVxuXG4gICAgICBWaWV3Q2xhc3Nbb2JzS2V5TmFtZV0ubm90aWZ5KGFyZyk7XG4gICAgfSksXG4gICAgdmlld05hbWUsXG4gICk7XG5cbiAgVmlld0NsYXNzLm9uID0gVmlld0NsYXNzLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiBjdXN0b21BZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZXM6IHN0cmluZywgY2FsbGJhY2s6IChkYXRhOiBFdmVudERhdGEpID0+IHZvaWQsIHRoaXNBcmc/OiBhbnkpIHtcbiAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgd3JpdGVHbG9iYWxFdmVudHNUcmFjZShgT246IFwiJHtldmVudE5hbWVzfVwiIHRoaXNBcmc6JHt0aGlzQXJnfSB0byBcIiR7dmlld05hbWV9XCJgKTtcbiAgICB9XG5cbiAgICBWaWV3Q2xhc3Nbb2JzS2V5TmFtZV0ub24oZXZlbnROYW1lcywgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICB9O1xuXG4gIFZpZXdDbGFzcy5vbmNlID0gZnVuY3Rpb24gY3VzdG9tQWRkT25jZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lczogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IEV2ZW50RGF0YSkgPT4gdm9pZCwgdGhpc0FyZz86IGFueSkge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZUdsb2JhbEV2ZW50c1RyYWNlKGBPbmNlOiBcIiR7ZXZlbnROYW1lc31cIiB0aGlzQXJnOiR7dGhpc0FyZ30gdG8gXCIke3ZpZXdOYW1lfVwiYCk7XG4gICAgfVxuXG4gICAgVmlld0NsYXNzW29ic0tleU5hbWVdLm9uY2UoZXZlbnROYW1lcywgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICB9O1xuXG4gIFZpZXdDbGFzcy5vZmYgPSBWaWV3Q2xhc3MucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIGN1c3RvbVJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lczogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgdGhpc0FyZz86IGFueSkge1xuICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICB3cml0ZUdsb2JhbEV2ZW50c1RyYWNlKGBSZW1vdmU6IFwiJHtldmVudE5hbWVzfVwiIHRoaXM6JHt0aGlzQXJnfSBmcm9tIFwiJHt2aWV3TmFtZX1cImApO1xuICAgIH1cblxuICAgIFZpZXdDbGFzc1tvYnNLZXlOYW1lXS5vZmYoZXZlbnROYW1lcywgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICB9O1xufVxuXG4vLyBBZGQgdGhlIGdsb2JhbCBldmVudHMgdG8gdGhlIFZpZXctY2xhc3MgYmVmb3JlIGFkZGluZyBpdCB0byB0aGUgc3ViLWNsYXNzZXMuXG5zZXR1cEdsb2JhbEV2ZW50c09uVmlld0NsYXNzKFZpZXdDb21tb24sICdWaWV3Q29tbW9uJyk7XG5zZXR1cEdsb2JhbEV2ZW50c09uVmlld0NsYXNzKFZpZXcsICdWaWV3Jyk7XG5zZXR1cEdsb2JhbEV2ZW50c09uVmlld0NsYXNzKFRleHRCYXNlLCAnVGV4dEJhc2UnKTtcbnNldHVwR2xvYmFsRXZlbnRzT25WaWV3Q2xhc3MoQ29udGFpbmVyVmlldywgJ0NvbnRhaW5lclZpZXcnKTtcbnNldHVwR2xvYmFsRXZlbnRzT25WaWV3Q2xhc3MoTGF5b3V0QmFzZSwgJ0xheW91dEJhc2UnKTtcblxuZm9yIChjb25zdCB7IHZpZXdDbGFzcywgdmlld05hbWUgfSBvZiBbXG4gIHsgdmlld0NsYXNzOiBBYnNvbHV0ZUxheW91dCwgdmlld05hbWU6ICdBYnNvbHV0ZUxheW91dCcgfSxcbiAgeyB2aWV3Q2xhc3M6IEFjdGlvbkJhciwgdmlld05hbWU6ICdBY3Rpb25CYXInIH0sXG4gIHsgdmlld0NsYXNzOiBBY3Rpdml0eUluZGljYXRvciwgdmlld05hbWU6ICdBY3Rpdml0eUluZGljYXRvcicgfSxcbiAgeyB2aWV3Q2xhc3M6IEJ1dHRvbiwgdmlld05hbWU6ICdCdXR0b24nIH0sXG4gIHsgdmlld0NsYXNzOiBDdXN0b21MYXlvdXRWaWV3LCB2aWV3TmFtZTogJ0N1c3RvbUxheW91dFZpZXcnIH0sXG4gIHsgdmlld0NsYXNzOiBEYXRlUGlja2VyLCB2aWV3TmFtZTogJ0RhdGVQaWNrZXInIH0sXG4gIHsgdmlld0NsYXNzOiBEb2NrTGF5b3V0LCB2aWV3TmFtZTogJ0RvY2tMYXlvdXQnIH0sXG4gIHsgdmlld0NsYXNzOiBFZGl0YWJsZVRleHRCYXNlLCB2aWV3TmFtZTogJ0VkaXRhYmxlVGV4dEJhc2UnIH0sXG4gIHsgdmlld0NsYXNzOiBGbGV4Ym94TGF5b3V0LCB2aWV3TmFtZTogJ0ZsZXhib3hMYXlvdXQnIH0sXG4gIHsgdmlld0NsYXNzOiBGcmFtZSwgdmlld05hbWU6ICdGcmFtZScgfSxcbiAgeyB2aWV3Q2xhc3M6IEdyaWRMYXlvdXQsIHZpZXdOYW1lOiAnR3JpZExheW91dCcgfSxcbiAgeyB2aWV3Q2xhc3M6IEh0bWxWaWV3LCB2aWV3TmFtZTogJ0h0bWxWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogSW1hZ2UsIHZpZXdOYW1lOiAnSW1hZ2UnIH0sXG4gIHsgdmlld0NsYXNzOiBMYWJlbCwgdmlld05hbWU6ICdMYWJlbCcgfSxcbiAgeyB2aWV3Q2xhc3M6IExpc3RQaWNrZXIsIHZpZXdOYW1lOiAnTGlzdFBpY2tlcicgfSxcbiAgeyB2aWV3Q2xhc3M6IExpc3RWaWV3LCB2aWV3TmFtZTogJ0xpc3RWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogUGFnZSwgdmlld05hbWU6ICdQYWdlJyB9LFxuICB7IHZpZXdDbGFzczogUGxhY2Vob2xkZXIsIHZpZXdOYW1lOiAnUGxhY2Vob2xkZXInIH0sXG4gIHsgdmlld0NsYXNzOiBQcm9ncmVzcywgdmlld05hbWU6ICdQcm9ncmVzcycgfSxcbiAgeyB2aWV3Q2xhc3M6IFJlcGVhdGVyLCB2aWV3TmFtZTogJ1JlcGVhdGVyJyB9LFxuICB7IHZpZXdDbGFzczogU2Nyb2xsVmlldywgdmlld05hbWU6ICdTY3JvbGxWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogU2VhcmNoQmFyLCB2aWV3TmFtZTogJ1NlYXJjaEJhcicgfSxcbiAgeyB2aWV3Q2xhc3M6IFNlZ21lbnRlZEJhciwgdmlld05hbWU6ICdTZWdtZW50ZWRCYXInIH0sXG4gIHsgdmlld0NsYXNzOiBTbGlkZXIsIHZpZXdOYW1lOiAnU2xpZGVyJyB9LFxuICB7IHZpZXdDbGFzczogU3RhY2tMYXlvdXQsIHZpZXdOYW1lOiAnU3RhY2tMYXlvdXQnIH0sXG4gIHsgdmlld0NsYXNzOiBTd2l0Y2gsIHZpZXdOYW1lOiAnU3dpdGNoJyB9LFxuICB7IHZpZXdDbGFzczogVGFiVmlldywgdmlld05hbWU6ICdUYWJWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogVGV4dEZpZWxkLCB2aWV3TmFtZTogJ1RleHRGaWVsZCcgfSxcbiAgeyB2aWV3Q2xhc3M6IFRleHRWaWV3LCB2aWV3TmFtZTogJ1RleHRWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogVGltZVBpY2tlciwgdmlld05hbWU6ICdUaW1lUGlja2VyJyB9LFxuICB7IHZpZXdDbGFzczogV2ViVmlldywgdmlld05hbWU6ICdXZWJWaWV3JyB9LFxuICB7IHZpZXdDbGFzczogV3JhcExheW91dCwgdmlld05hbWU6ICdXcmFwTGF5b3V0JyB9LFxuXSkge1xuICBzZXR1cEdsb2JhbEV2ZW50c09uVmlld0NsYXNzKHZpZXdDbGFzcywgdmlld05hbWUpO1xufVxuIl19