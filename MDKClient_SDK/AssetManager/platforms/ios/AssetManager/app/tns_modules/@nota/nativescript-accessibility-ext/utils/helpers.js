"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var profiling_1 = require("@nativescript/core/profiling");
var properties_1 = require("@nativescript/core/ui/core/properties");
var view_1 = require("@nativescript/core/ui/core/view");
var trace_1 = require("../trace");
var lastFocusedViewOnPageKeyName = '__lastFocusedViewOnPage';
function getLastFocusedViewOnPage(page) {
    try {
        var lastFocusedViewRef = page[lastFocusedViewOnPageKeyName];
        if (!lastFocusedViewRef) {
            return null;
        }
        var lastFocusedView = lastFocusedViewRef.get();
        if (!lastFocusedView) {
            return null;
        }
        if (!lastFocusedView.parent || lastFocusedView.page !== page) {
            return null;
        }
        return lastFocusedView;
    }
    catch (_a) {
    }
    finally {
        delete page[lastFocusedViewOnPageKeyName];
    }
    return null;
}
exports.getLastFocusedViewOnPage = getLastFocusedViewOnPage;
function noop() {
}
exports.noop = noop;
function makePropertyEnumConverter(enumValues) {
    return function (value) {
        var e_1, _a;
        if (!value) {
            return null;
        }
        try {
            for (var _b = __values(Object.entries(enumValues)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], v = _d[1];
                if (key === value || "" + v === ("" + value).toLowerCase()) {
                    return v;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
}
exports.makePropertyEnumConverter = makePropertyEnumConverter;
function setViewFunction(viewClass, fnName, fn) {
    viewClass.prototype[fnName] = fn || noop;
}
exports.setViewFunction = setViewFunction;
function getOriginalWrappedFnName(viewName, fnName) {
    return "___a11y_" + viewName + "_" + fnName;
}
function wrapFunction(obj, fnName, func, objName) {
    var origFNName = getOriginalWrappedFnName(objName, fnName);
    obj[origFNName] = (obj[origFNName] || obj[fnName]);
    obj[fnName] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var origFN = obj[origFNName];
        if (!origFN) {
            trace_1.writeErrorTrace("wrapFunction(" + obj + ") don't have an original function for " + fnName);
            origFN = noop;
        }
        var res = origFN.call.apply(origFN, __spread([this], args));
        func.call.apply(func, __spread([this], args));
        return res;
    };
}
exports.wrapFunction = wrapFunction;
function unwrapFunction(obj, fnName, viewName) {
    var origFNName = getOriginalWrappedFnName(viewName, fnName);
    if (!obj[origFNName]) {
        return;
    }
    obj[fnName] = obj[origFNName];
    delete obj[origFNName];
}
exports.unwrapFunction = unwrapFunction;
function enforceArray(val) {
    if (Array.isArray(val)) {
        return val;
    }
    if (typeof val === 'string') {
        return val.split(/[, ]/g).filter(function (v) { return !!v; });
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeTrace("enforceArray: val is of unsupported type: " + val + " -> " + typeof val);
    }
    return [];
}
exports.enforceArray = enforceArray;
function inputArrayToBitMask(values, map) {
    return (enforceArray(values)
        .filter(function (value) { return !!value; })
        .map(function (value) { return ("" + value).toLocaleLowerCase(); })
        .filter(function (value) { return map.has(value); })
        .reduce(function (res, value) { return res | map.get(value); }, 0) || 0);
}
exports.inputArrayToBitMask = inputArrayToBitMask;
function addPropertyToView(viewClass, name, defaultValue, valueConverter) {
    var property = new properties_1.Property({
        name: name,
        defaultValue: defaultValue,
        valueConverter: valueConverter,
    });
    property.register(viewClass);
    return property;
}
exports.addPropertyToView = addPropertyToView;
function addBooleanPropertyToView(viewClass, name, defaultValue) {
    return addPropertyToView(viewClass, name, defaultValue, view_1.booleanConverter);
}
exports.addBooleanPropertyToView = addBooleanPropertyToView;
function addCssPropertyToView(viewClass, name, cssName, inherited, defaultValue, valueConverter) {
    if (inherited === void 0) { inherited = false; }
    var property;
    if (inherited) {
        property = new properties_1.InheritedCssProperty({
            name: name,
            cssName: cssName,
            defaultValue: defaultValue,
            valueConverter: valueConverter,
        });
    }
    else {
        property = new properties_1.CssProperty({
            name: name,
            cssName: cssName,
            defaultValue: defaultValue,
            valueConverter: valueConverter,
        });
    }
    Object.defineProperty(viewClass.prototype, name, {
        set: function (value) {
            this.style[name] = value;
        },
        get: function () {
            return this.style[name];
        },
    });
    property.register(properties_1.Style);
    return property;
}
exports.addCssPropertyToView = addCssPropertyToView;
function addBooleanCssPropertyToView(viewClass, name, cssName, inherited, defaultValue) {
    if (inherited === void 0) { inherited = false; }
    return addCssPropertyToView(viewClass, name, cssName, inherited, defaultValue, view_1.booleanConverter);
}
exports.addBooleanCssPropertyToView = addBooleanCssPropertyToView;
exports.notifyAccessibilityFocusState = profiling_1.profile('notifyAccessibilityFocusState', function notifyAccessibilityFocusStateImpl(tnsView, receivedFocus, lostFocus) {
    if (!receivedFocus && !lostFocus) {
        return;
    }
    if (trace_1.isTraceEnabled()) {
        trace_1.writeTrace("notifyAccessibilityFocusState: " + JSON.stringify({
            name: 'notifyAccessibilityFocusState',
            receivedFocus: receivedFocus,
            lostFocus: lostFocus,
            view: "" + tnsView,
        }));
    }
    tnsView.notify({
        eventName: view_1.View.accessibilityFocusChangedEvent,
        object: tnsView,
        value: !!receivedFocus,
    });
    if (receivedFocus) {
        if (tnsView.page) {
            tnsView.page[lastFocusedViewOnPageKeyName] = new WeakRef(tnsView);
        }
        tnsView.notify({
            eventName: view_1.View.accessibilityFocusEvent,
            object: tnsView,
        });
    }
    else if (lostFocus) {
        tnsView.notify({
            eventName: view_1.View.accessibilityBlurEvent,
            object: tnsView,
        });
    }
});
function getViewNgCssClassesMap(view) {
    if (typeof Zone === 'undefined') {
        return new Map();
    }
    if (!view.ngCssClasses) {
        view.ngCssClasses = new Map();
    }
    return view.ngCssClasses;
}
exports.getViewNgCssClassesMap = getViewNgCssClassesMap;
function hmrSafeEvents(fnName, events, obj, callback, thisArg) {
    var e_2, _a, e_3, _b;
    if (fnName in obj) {
        try {
            for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                var eventName = events_1_1.value;
                obj.off(eventName, obj[fnName]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    obj[fnName] = thisArg ? callback.bind(thisArg) : callback;
    try {
        for (var events_2 = __values(events), events_2_1 = events_2.next(); !events_2_1.done; events_2_1 = events_2.next()) {
            var eventName = events_2_1.value;
            obj.on(eventName, obj[fnName]);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (events_2_1 && !events_2_1.done && (_b = events_2.return)) _b.call(events_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
exports.hmrSafeEvents = hmrSafeEvents;
function viewSetCssClasses(view, a11yCssClasses) {
    var e_4, _a, e_5, _b;
    if (typeof Zone !== 'undefined') {
        var ngCssClasses = getViewNgCssClassesMap(view);
        try {
            for (var _c = __values(Object.entries(a11yCssClasses)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), className = _e[0], enabled = _e[1];
                if (enabled) {
                    ngCssClasses.set(className, true);
                }
                else {
                    ngCssClasses.delete(className);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    var changed = false;
    try {
        for (var _f = __values(Object.entries(a11yCssClasses)), _g = _f.next(); !_g.done; _g = _f.next()) {
            var _h = __read(_g.value, 2), className = _h[0], enabled = _h[1];
            if (view.cssClasses.has(className)) {
                if (enabled) {
                    continue;
                }
                view.cssClasses.delete(className);
                changed = true;
                continue;
            }
            if (enabled) {
                view.cssClasses.add(className);
                changed = true;
                continue;
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_5) throw e_5.error; }
    }
    if (changed) {
        view._onCssStateChange();
    }
    return changed;
}
exports.viewSetCssClasses = viewSetCssClasses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwREFBdUQ7QUFDdkQsb0VBQTJHO0FBQzNHLHdEQU15QztBQUV6QyxrQ0FBdUU7QUFFdkUsSUFBTSw0QkFBNEIsR0FBRyx5QkFBeUIsQ0FBQztBQUUvRCxTQUFnQix3QkFBd0IsQ0FBQyxJQUFVO0lBQ2pELElBQUk7UUFDRixJQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBa0IsQ0FBQztRQUMvRSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxJQUFJLGVBQWUsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzVELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLGVBQWUsQ0FBQztLQUN4QjtJQUFDLFdBQU07S0FFUDtZQUFTO1FBQ1IsT0FBTyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUMzQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXhCRCw0REF3QkM7QUFLRCxTQUFnQixJQUFJO0FBRXBCLENBQUM7QUFGRCxvQkFFQztBQUVELFNBQWdCLHlCQUF5QixDQUFJLFVBQWU7SUFDMUQsT0FBTyxVQUFDLEtBQWE7O1FBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQztTQUNiOztZQUVELEtBQXVCLElBQUEsS0FBQSxTQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUksVUFBVSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQTNDLElBQUEsd0JBQVEsRUFBUCxXQUFHLEVBQUUsU0FB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Q0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDaEM7YUFDRjs7Ozs7Ozs7O0tBQ0Y7SUFFRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7O1FBQ3BCLEtBQW1DLElBQUEsS0FBQSxTQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7WUFBeEQsSUFBQSx3QkFBb0IsRUFBbkIsaUJBQVMsRUFBRSxlQUFPO1lBQzVCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2xDLElBQUksT0FBTyxFQUFFO29CQUNYLFNBQVM7aUJBQ1Y7Z0JBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRWxDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBRWYsU0FBUzthQUNWO1lBRUQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRS9CLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsU0FBUzthQUNWO1NBQ0Y7Ozs7Ozs7OztJQUVELElBQUksT0FBTyxFQUFFO1FBQ1gsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDMUI7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBekNELDhDQXlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91aS9jb3JlL3ZpZXcuZC50c1wiIC8+XG5cbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IENzc1Byb3BlcnR5LCBJbmhlcml0ZWRDc3NQcm9wZXJ0eSwgUHJvcGVydHksIFN0eWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2NvcmUvcHJvcGVydGllcyc7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5Qmx1ckV2ZW50RGF0YSxcbiAgQWNjZXNzaWJpbGl0eUZvY3VzQ2hhbmdlZEV2ZW50RGF0YSxcbiAgQWNjZXNzaWJpbGl0eUZvY3VzRXZlbnREYXRhLFxuICBib29sZWFuQ29udmVydGVyLFxuICBWaWV3LFxufSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvY29yZS92aWV3JztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvcGFnZSc7XG5pbXBvcnQgeyBpc1RyYWNlRW5hYmxlZCwgd3JpdGVFcnJvclRyYWNlLCB3cml0ZVRyYWNlIH0gZnJvbSAnLi4vdHJhY2UnO1xuXG5jb25zdCBsYXN0Rm9jdXNlZFZpZXdPblBhZ2VLZXlOYW1lID0gJ19fbGFzdEZvY3VzZWRWaWV3T25QYWdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhc3RGb2N1c2VkVmlld09uUGFnZShwYWdlOiBQYWdlKTogVmlldyB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IGxhc3RGb2N1c2VkVmlld1JlZiA9IHBhZ2VbbGFzdEZvY3VzZWRWaWV3T25QYWdlS2V5TmFtZV0gYXMgV2Vha1JlZjxWaWV3PjtcbiAgICBpZiAoIWxhc3RGb2N1c2VkVmlld1JlZikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEZvY3VzZWRWaWV3ID0gbGFzdEZvY3VzZWRWaWV3UmVmLmdldCgpO1xuICAgIGlmICghbGFzdEZvY3VzZWRWaWV3KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIWxhc3RGb2N1c2VkVmlldy5wYXJlbnQgfHwgbGFzdEZvY3VzZWRWaWV3LnBhZ2UgIT09IHBhZ2UpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0Rm9jdXNlZFZpZXc7XG4gIH0gY2F0Y2gge1xuICAgIC8vIGlnbm9yZVxuICB9IGZpbmFsbHkge1xuICAgIGRlbGV0ZSBwYWdlW2xhc3RGb2N1c2VkVmlld09uUGFnZUtleU5hbWVdO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogRHVtbXkgZnVuY3Rpb24gdGhhdCBkb2VzIG5vdGhpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge1xuICAvLyBpZ25vcmVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQcm9wZXJ0eUVudW1Db252ZXJ0ZXI8VD4oZW51bVZhbHVlczogYW55KSB7XG4gIHJldHVybiAodmFsdWU6IHN0cmluZyk6IFQgfCBudWxsID0+IHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtrZXksIHZdIG9mIE9iamVjdC5lbnRyaWVzPFQ+KGVudW1WYWx1ZXMpKSB7XG4gICAgICBpZiAoa2V5ID09PSB2YWx1ZSB8fCBgJHt2fWAgPT09IGAke3ZhbHVlfWAudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWaWV3VHlwZTxUIGV4dGVuZHMgVmlldz4ge1xuICBuZXcgKCk6IFQ7XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGZ1bmN0aW9uIHRvIGEgVmlldy1jbGFzc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Vmlld0Z1bmN0aW9uKHZpZXdDbGFzczogYW55LCBmbk5hbWU6IHN0cmluZywgZm4/OiBGdW5jdGlvbikge1xuICB2aWV3Q2xhc3MucHJvdG90eXBlW2ZuTmFtZV0gPSBmbiB8fCBub29wO1xufVxuXG5mdW5jdGlvbiBnZXRPcmlnaW5hbFdyYXBwZWRGbk5hbWUodmlld05hbWU6IHN0cmluZywgZm5OYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBfX19hMTF5XyR7dmlld05hbWV9XyR7Zm5OYW1lfWA7XG59XG5cbi8qKlxuICogV3JhcCBhIGZ1bmN0aW9uIG9uIGFuIG9iamVjdC5cbiAqIFRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIGZ1bmMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwRnVuY3Rpb24ob2JqOiBhbnksIGZuTmFtZTogc3RyaW5nLCBmdW5jOiBGdW5jdGlvbiwgb2JqTmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IG9yaWdGTk5hbWUgPSBnZXRPcmlnaW5hbFdyYXBwZWRGbk5hbWUob2JqTmFtZSwgZm5OYW1lKTtcblxuICBvYmpbb3JpZ0ZOTmFtZV0gPSAob2JqW29yaWdGTk5hbWVdIHx8IG9ialtmbk5hbWVdKSBhcyBGdW5jdGlvbjtcblxuICBvYmpbZm5OYW1lXSA9IGZ1bmN0aW9uKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgbGV0IG9yaWdGTiA9IG9ialtvcmlnRk5OYW1lXTtcbiAgICBpZiAoIW9yaWdGTikge1xuICAgICAgd3JpdGVFcnJvclRyYWNlKGB3cmFwRnVuY3Rpb24oJHtvYmp9KSBkb24ndCBoYXZlIGFuIG9yaWdpbmFsIGZ1bmN0aW9uIGZvciAke2ZuTmFtZX1gKTtcblxuICAgICAgb3JpZ0ZOID0gbm9vcDtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSBvcmlnRk4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcblxuICAgIGZ1bmMuY2FsbCh0aGlzLCAuLi5hcmdzKTtcblxuICAgIHJldHVybiByZXM7XG4gIH07XG59XG5cbi8qKlxuICogVW53cmFwIGEgZnVuY3Rpb24gb24gYSBjbGFzcyB3cmFwcGVkIGJ5IHdyYXBGdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcEZ1bmN0aW9uKG9iajogYW55LCBmbk5hbWU6IHN0cmluZywgdmlld05hbWU6IHN0cmluZykge1xuICBjb25zdCBvcmlnRk5OYW1lID0gZ2V0T3JpZ2luYWxXcmFwcGVkRm5OYW1lKHZpZXdOYW1lLCBmbk5hbWUpO1xuICBpZiAoIW9ialtvcmlnRk5OYW1lXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG9ialtmbk5hbWVdID0gb2JqW29yaWdGTk5hbWVdO1xuICBkZWxldGUgb2JqW29yaWdGTk5hbWVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5mb3JjZUFycmF5KHZhbDogc3RyaW5nIHwgc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbC5zcGxpdCgvWywgXS9nKS5maWx0ZXIoKHY6IHN0cmluZykgPT4gISF2KTtcbiAgfVxuXG4gIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgd3JpdGVUcmFjZShgZW5mb3JjZUFycmF5OiB2YWwgaXMgb2YgdW5zdXBwb3J0ZWQgdHlwZTogJHt2YWx9IC0+ICR7dHlwZW9mIHZhbH1gKTtcbiAgfVxuXG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIHZhbHVlcyBpbnRvIGEgYml0bWFzay5cbiAqXG4gKiBAcGFyYW0gdmFsdWVzIHN0cmluZyB2YWx1ZXNcbiAqIEBwYXJhbSBtYXAgICAgbWFwIGxvd2VyLWNhc2UgbmFtZSB0byBpbnRlZ2VyIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5wdXRBcnJheVRvQml0TWFzayh2YWx1ZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBtYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4pOiBudW1iZXIge1xuICByZXR1cm4gKFxuICAgIGVuZm9yY2VBcnJheSh2YWx1ZXMpXG4gICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gISF2YWx1ZSlcbiAgICAgIC5tYXAoKHZhbHVlKSA9PiBgJHt2YWx1ZX1gLnRvTG9jYWxlTG93ZXJDYXNlKCkpXG4gICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gbWFwLmhhcyh2YWx1ZSkpXG4gICAgICAucmVkdWNlKChyZXMsIHZhbHVlKSA9PiByZXMgfCBtYXAuZ2V0KHZhbHVlKSwgMCkgfHwgMFxuICApO1xufVxuXG4vKipcbiAqIEV4dGVuZCBOYXRpdmVTY3JpcHQgVmlldyB3aXRoIGEgbmV3IHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUHJvcGVydHlUb1ZpZXc8Vmlld0NsYXNzIGV4dGVuZHMgVmlldywgVD4oXG4gIHZpZXdDbGFzczogVmlld1R5cGU8Vmlld0NsYXNzPixcbiAgbmFtZTogc3RyaW5nLFxuICBkZWZhdWx0VmFsdWU/OiBULFxuICB2YWx1ZUNvbnZlcnRlcj86ICh2YWx1ZTogc3RyaW5nKSA9PiBULFxuKTogUHJvcGVydHk8Vmlld0NsYXNzLCBUPiB7XG4gIGNvbnN0IHByb3BlcnR5ID0gbmV3IFByb3BlcnR5PFZpZXdDbGFzcywgVD4oe1xuICAgIG5hbWUsXG4gICAgZGVmYXVsdFZhbHVlLFxuICAgIHZhbHVlQ29udmVydGVyLFxuICB9KTtcbiAgcHJvcGVydHkucmVnaXN0ZXIodmlld0NsYXNzKTtcblxuICByZXR1cm4gcHJvcGVydHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRCb29sZWFuUHJvcGVydHlUb1ZpZXc8Vmlld0NsYXNzIGV4dGVuZHMgVmlldz4oXG4gIHZpZXdDbGFzczogVmlld1R5cGU8Vmlld0NsYXNzPixcbiAgbmFtZTogc3RyaW5nLFxuICBkZWZhdWx0VmFsdWU/OiBib29sZWFuLFxuKTogUHJvcGVydHk8Vmlld0NsYXNzLCBib29sZWFuPiB7XG4gIHJldHVybiBhZGRQcm9wZXJ0eVRvVmlldyh2aWV3Q2xhc3MsIG5hbWUsIGRlZmF1bHRWYWx1ZSwgYm9vbGVhbkNvbnZlcnRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDc3NQcm9wZXJ0eVRvVmlldzxWaWV3Q2xhc3MgZXh0ZW5kcyBWaWV3LCBUPihcbiAgdmlld0NsYXNzOiBWaWV3VHlwZTxWaWV3Q2xhc3M+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNzc05hbWU6IHN0cmluZyxcbiAgaW5oZXJpdGVkID0gZmFsc2UsXG4gIGRlZmF1bHRWYWx1ZT86IFQsXG4gIHZhbHVlQ29udmVydGVyPzogKHZhbHVlOiBzdHJpbmcpID0+IFQsXG4pOiBDc3NQcm9wZXJ0eTxTdHlsZSwgVD4ge1xuICBsZXQgcHJvcGVydHk6IENzc1Byb3BlcnR5PFN0eWxlLCBUPiB8IEluaGVyaXRlZENzc1Byb3BlcnR5PFN0eWxlLCBUPjtcblxuICBpZiAoaW5oZXJpdGVkKSB7XG4gICAgcHJvcGVydHkgPSBuZXcgSW5oZXJpdGVkQ3NzUHJvcGVydHkoe1xuICAgICAgbmFtZSxcbiAgICAgIGNzc05hbWUsXG4gICAgICBkZWZhdWx0VmFsdWUsXG4gICAgICB2YWx1ZUNvbnZlcnRlcixcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwcm9wZXJ0eSA9IG5ldyBDc3NQcm9wZXJ0eSh7XG4gICAgICBuYW1lLFxuICAgICAgY3NzTmFtZSxcbiAgICAgIGRlZmF1bHRWYWx1ZSxcbiAgICAgIHZhbHVlQ29udmVydGVyLFxuICAgIH0pO1xuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZpZXdDbGFzcy5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBzZXQodGhpczogVmlld0NsYXNzLCB2YWx1ZTogVCkge1xuICAgICAgdGhpcy5zdHlsZVtuYW1lXSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0KHRoaXM6IFZpZXdDbGFzcykge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVbbmFtZV07XG4gICAgfSxcbiAgfSk7XG5cbiAgcHJvcGVydHkucmVnaXN0ZXIoU3R5bGUpO1xuXG4gIHJldHVybiBwcm9wZXJ0eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEJvb2xlYW5Dc3NQcm9wZXJ0eVRvVmlldzxWaWV3Q2xhc3MgZXh0ZW5kcyBWaWV3PihcbiAgdmlld0NsYXNzOiBWaWV3VHlwZTxWaWV3Q2xhc3M+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNzc05hbWU6IHN0cmluZyxcbiAgaW5oZXJpdGVkID0gZmFsc2UsXG4gIGRlZmF1bHRWYWx1ZT86IGJvb2xlYW4sXG4pIHtcbiAgcmV0dXJuIGFkZENzc1Byb3BlcnR5VG9WaWV3KHZpZXdDbGFzcywgbmFtZSwgY3NzTmFtZSwgaW5oZXJpdGVkLCBkZWZhdWx0VmFsdWUsIGJvb2xlYW5Db252ZXJ0ZXIpO1xufVxuXG4vKipcbiAqIFNlbmQgbm90aWZpY2F0aW9uIHdoZW4gYWNjZXNzaWJpbGl0eSBmb2N1cyBzdGF0ZSBjaGFuZ2VzLlxuICogSWYgZWl0aGVyIHJlY2VpdmVkRm9jdXMgb3IgbG9zdEZvY3VzIGlzIHRydWUsICdhY2Nlc3NpYmlsaXR5Rm9jdXNDaGFuZ2VkJyBpcyBzZW5kIHdpdGggdmFsdWUgdHJ1ZSBpZiBlbGVtZW50IHJlY2VpdmVkIGZvY3VzXG4gKiBJZiByZWNlaXZlZEZvY3VzLCAnYWNjZXNzaWJpbGl0eUZvY3VzJyBpcyBzZW5kXG4gKiBpZiBsb3N0Rm9jdXMsICdhY2Nlc3NpYmlsaXR5Qmx1cicgaXMgc2VuZFxuICpcbiAqIEBwYXJhbSB7Vmlld30gdG5zVmlld1xuICogQHBhcmFtIHtib29sZWFufSByZWNlaXZlZEZvY3VzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGxvc3RGb2N1c1xuICovXG5leHBvcnQgY29uc3Qgbm90aWZ5QWNjZXNzaWJpbGl0eUZvY3VzU3RhdGUgPSBwcm9maWxlKCdub3RpZnlBY2Nlc3NpYmlsaXR5Rm9jdXNTdGF0ZScsIGZ1bmN0aW9uIG5vdGlmeUFjY2Vzc2liaWxpdHlGb2N1c1N0YXRlSW1wbChcbiAgdG5zVmlldzogVmlldyxcbiAgcmVjZWl2ZWRGb2N1czogYm9vbGVhbixcbiAgbG9zdEZvY3VzOiBib29sZWFuLFxuKTogdm9pZCB7XG4gIGlmICghcmVjZWl2ZWRGb2N1cyAmJiAhbG9zdEZvY3VzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICB3cml0ZVRyYWNlKFxuICAgICAgYG5vdGlmeUFjY2Vzc2liaWxpdHlGb2N1c1N0YXRlOiAke0pTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbmFtZTogJ25vdGlmeUFjY2Vzc2liaWxpdHlGb2N1c1N0YXRlJyxcbiAgICAgICAgcmVjZWl2ZWRGb2N1cyxcbiAgICAgICAgbG9zdEZvY3VzLFxuICAgICAgICB2aWV3OiBgJHt0bnNWaWV3fWAsXG4gICAgICB9KX1gLFxuICAgICk7XG4gIH1cblxuICB0bnNWaWV3Lm5vdGlmeSh7XG4gICAgZXZlbnROYW1lOiBWaWV3LmFjY2Vzc2liaWxpdHlGb2N1c0NoYW5nZWRFdmVudCxcbiAgICBvYmplY3Q6IHRuc1ZpZXcsXG4gICAgdmFsdWU6ICEhcmVjZWl2ZWRGb2N1cyxcbiAgfSBhcyBBY2Nlc3NpYmlsaXR5Rm9jdXNDaGFuZ2VkRXZlbnREYXRhKTtcblxuICBpZiAocmVjZWl2ZWRGb2N1cykge1xuICAgIGlmICh0bnNWaWV3LnBhZ2UpIHtcbiAgICAgIHRuc1ZpZXcucGFnZVtsYXN0Rm9jdXNlZFZpZXdPblBhZ2VLZXlOYW1lXSA9IG5ldyBXZWFrUmVmKHRuc1ZpZXcpO1xuICAgIH1cblxuICAgIHRuc1ZpZXcubm90aWZ5KHtcbiAgICAgIGV2ZW50TmFtZTogVmlldy5hY2Nlc3NpYmlsaXR5Rm9jdXNFdmVudCxcbiAgICAgIG9iamVjdDogdG5zVmlldyxcbiAgICB9IGFzIEFjY2Vzc2liaWxpdHlGb2N1c0V2ZW50RGF0YSk7XG4gIH0gZWxzZSBpZiAobG9zdEZvY3VzKSB7XG4gICAgdG5zVmlldy5ub3RpZnkoe1xuICAgICAgZXZlbnROYW1lOiBWaWV3LmFjY2Vzc2liaWxpdHlCbHVyRXZlbnQsXG4gICAgICBvYmplY3Q6IHRuc1ZpZXcsXG4gICAgfSBhcyBBY2Nlc3NpYmlsaXR5Qmx1ckV2ZW50RGF0YSk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIEdldCB0aGUgdmlldydzIG5nQ3NzQ2xhc3Nlcy1NYXAgZm9yIG5hdGl2ZXNjcmlwdC1hbmd1bGFyLlxuICogVGhpcyBuZWVkcyB0byBiZSB1cGRhdGVkIGlmIHRoZSBjc3MtY2xhc3MgaXMgdG8gcmVtYWluIGVuYWJsZWRcbiAqIG9uIHVwZGF0ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWaWV3TmdDc3NDbGFzc2VzTWFwKHZpZXc6IGFueSk6IE1hcDxzdHJpbmcsIGJvb2xlYW4+IHtcbiAgLy8gWm9uZSBpcyBnbG9iYWxseSBhdmFpbGFibGUgb24gbmF0aXZlc2NyaXB0LWFuZ3VsYXIuIElmIGRlZmluZWQgYXNzdW1lIGFuZ3VsYXIgZW52aXJvbm1lbnQuXG4gIGlmICh0eXBlb2YgWm9uZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gIH1cblxuICBpZiAoIXZpZXcubmdDc3NDbGFzc2VzKSB7XG4gICAgdmlldy5uZ0Nzc0NsYXNzZXMgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgfVxuXG4gIHJldHVybiB2aWV3Lm5nQ3NzQ2xhc3Nlcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBMTFZQ3NzQ2xhc3NlcyB7XG4gIFtjbGFzc05hbWU6IHN0cmluZ106IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSG1yU2FmZUV2ZW50c0NhbGxiYWNrIHtcbiAgKC4uLmFyZ3M6IGFueVtdKTogYW55O1xufVxuXG4vKipcbiAqIEFkZGluZyBnbG9iYWwgZXZlbnRzIGR1cmluZyBkZXZlbG9wbWVudCBpcyBwcm9ibGVtYXRpYywgd2hlbiBITVIgaXMgZW5hYmxlZC5cbiAqIFRoaXMgaGVscGVyIHNvbHZlZCB0aGUgcHJvYmxlbSwgYnkgcmVtb3ZpbmcgdGhlIG9sZCBldmVudCBiZWZvcmUgYWRkaW5nIHRoZSBuZXcgZXZlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhtclNhZmVFdmVudHMoXG4gIGZuTmFtZTogc3RyaW5nLFxuICBldmVudHM6IHN0cmluZ1tdLFxuICBvYmo6IHtcbiAgICBvbihldmVudE5hbWU6IHN0cmluZywgY2I6IEhtclNhZmVFdmVudHNDYWxsYmFjayk6IHZvaWQ7XG4gICAgb2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBjYjogSG1yU2FmZUV2ZW50c0NhbGxiYWNrKTogdm9pZDtcbiAgfSxcbiAgY2FsbGJhY2s6IEhtclNhZmVFdmVudHNDYWxsYmFjayxcbiAgdGhpc0FyZz86IGFueSxcbikge1xuICBpZiAoZm5OYW1lIGluIG9iaikge1xuICAgIGZvciAoY29uc3QgZXZlbnROYW1lIG9mIGV2ZW50cykge1xuICAgICAgb2JqLm9mZihldmVudE5hbWUsIG9ialtmbk5hbWVdKTtcbiAgICB9XG4gIH1cblxuICBvYmpbZm5OYW1lXSA9IHRoaXNBcmcgPyBjYWxsYmFjay5iaW5kKHRoaXNBcmcpIDogY2FsbGJhY2s7XG4gIGZvciAoY29uc3QgZXZlbnROYW1lIG9mIGV2ZW50cykge1xuICAgIG9iai5vbihldmVudE5hbWUsIG9ialtmbk5hbWVdKTtcbiAgfVxufVxuXG5kZWNsYXJlIGNvbnN0IFpvbmU6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiB2aWV3U2V0Q3NzQ2xhc3Nlcyh2aWV3OiBWaWV3LCBhMTF5Q3NzQ2xhc3NlczogQTExWUNzc0NsYXNzZXMpOiBib29sZWFuIHtcbiAgLy8gWm9uZSBpcyBnbG9iYWxseSBhdmFpbGFibGUgb24gbmF0aXZlc2NyaXB0LWFuZ3VsYXIuIElmIGRlZmluZWQgYXNzdW1lIGFuZ3VsYXIgZW52aXJvbm1lbnQuXG4gIGlmICh0eXBlb2YgWm9uZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zdCBuZ0Nzc0NsYXNzZXMgPSBnZXRWaWV3TmdDc3NDbGFzc2VzTWFwKHZpZXcpO1xuXG4gICAgZm9yIChjb25zdCBbY2xhc3NOYW1lLCBlbmFibGVkXSBvZiBPYmplY3QuZW50cmllcyhhMTF5Q3NzQ2xhc3NlcykpIHtcbiAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgIG5nQ3NzQ2xhc3Nlcy5zZXQoY2xhc3NOYW1lLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5nQ3NzQ2xhc3Nlcy5kZWxldGUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBmb3IgKGNvbnN0IFtjbGFzc05hbWUsIGVuYWJsZWRdIG9mIE9iamVjdC5lbnRyaWVzKGExMXlDc3NDbGFzc2VzKSkge1xuICAgIGlmICh2aWV3LmNzc0NsYXNzZXMuaGFzKGNsYXNzTmFtZSkpIHtcbiAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2aWV3LmNzc0NsYXNzZXMuZGVsZXRlKGNsYXNzTmFtZSk7XG5cbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgdmlldy5jc3NDbGFzc2VzLmFkZChjbGFzc05hbWUpO1xuXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjaGFuZ2VkKSB7XG4gICAgdmlldy5fb25Dc3NTdGF0ZUNoYW5nZSgpO1xuICB9XG5cbiAgcmV0dXJuIGNoYW5nZWQ7XG59XG4iXX0=