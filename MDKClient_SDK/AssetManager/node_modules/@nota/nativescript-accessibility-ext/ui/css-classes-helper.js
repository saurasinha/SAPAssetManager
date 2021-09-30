"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nsApp = require("@nativescript/core/application/application");
var system_classes_1 = require("@nativescript/core/css/system-classes");
var platform_1 = require("@nativescript/core/platform");
var profiling_1 = require("@nativescript/core/profiling");
var view_1 = require("@nativescript/core/ui/core/view");
var trace_1 = require("../trace");
var FontScaleObservable_1 = require("../utils/FontScaleObservable");
require("../utils/global-events");
var helpers_1 = require("../utils/helpers");
var utils_1 = require("../utils/utils");
var view_common_1 = require("./core/view-common");
var fontExtraSmallClass = "a11y-fontscale-xs";
var fontExtraMediumClass = "a11y-fontscale-m";
var fontExtraLargeClass = "a11y-fontscale-xl";
var a11yServiceEnabledClass = "a11y-service-enabled";
var a11yServiceDisabledClass = "a11y-service-disabled";
var rootA11YClass = 'ns-a11y';
var A11YCssClassHelper = (function () {
    function A11YCssClassHelper() {
        var _this = this;
        this.cls = "CssClassesHelper";
        this.fontScaleCssClasses = new Map(FontScaleObservable_1.FontScaleObservable.VALID_FONT_SCALES.map(function (fs) { return [fs, "a11y-fontscale-" + Number(fs * 100).toFixed(0)]; }));
        this.currentFontScaleClass = '';
        this.currentFontScaleCategory = '';
        this.currentA11YStatusClass = '';
        this.currentRootA11YClass = '';
        this.fontScaleObservable = new FontScaleObservable_1.FontScaleObservable();
        this.a11yServiceObservable = new utils_1.AccessibilityServiceEnabledObservable();
        this.loadedModalViewRefs = new Map();
        this.fontScaleObservable.on(FontScaleObservable_1.FontScaleObservable.propertyChangeEvent, this.fontScaleChanged, this);
        this.a11yServiceObservable.on(utils_1.AccessibilityServiceEnabledObservable.propertyChangeEvent, this.a11yServiceChanged, this);
        helpers_1.hmrSafeEvents(this.cls + ".updateRootViews", [nsApp.displayedEvent, nsApp.resumeEvent], nsApp, function (evt) {
            _this.updateRootViews(evt);
        });
        helpers_1.hmrSafeEvents(this.cls + ".modalViewShowing", [view_1.View.shownModallyEvent], view_common_1.ViewCommon, function (evt) {
            _this.addModalViewRef(evt.object);
        });
    }
    A11YCssClassHelper.prototype.updateRootViews = function (evt) {
        var e_1, _a;
        evt = __assign({}, evt);
        var cls = this.cls + ".updateRootViews({eventName: " + evt.eventName + ", object: " + evt.object + "})";
        if (!this.updateCurrentHelperClasses()) {
            if (trace_1.isTraceEnabled()) {
                trace_1.writeTrace(cls + " - no changes");
            }
            return;
        }
        try {
            for (var _b = __values(__spread([nsApp.getRootView()], this.getModalViews())), _c = _b.next(); !_c.done; _c = _b.next()) {
                var view = _c.value;
                if (!view) {
                    continue;
                }
                if (trace_1.isTraceEnabled()) {
                    trace_1.writeTrace(cls + " - update css state on " + view);
                }
                view._onCssStateChange();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    A11YCssClassHelper.prototype.getModalViews = function () {
        var e_2, _a;
        var views = [];
        try {
            for (var _b = __values(this.loadedModalViewRefs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), id = _d[0], viewRef = _d[1];
                var view = viewRef.get();
                if (!view) {
                    this.loadedModalViewRefs.delete(id);
                    continue;
                }
                views.push(view);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return views;
    };
    A11YCssClassHelper.prototype.addModalViewRef = function (modalView) {
        var e_3, _a;
        try {
            for (var _b = __values(this.loadedModalViewRefs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), id = _d[0], viewRef = _d[1];
                var otherView = viewRef.get();
                if (!otherView) {
                    this.loadedModalViewRefs.delete(id);
                    continue;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.loadedModalViewRefs.set("" + modalView, new WeakRef(modalView));
    };
    A11YCssClassHelper.prototype.removeCssClass = function (cssClass) {
        system_classes_1.removeSystemCssClass(cssClass);
        __spread([nsApp.getRootView()], this.getModalViews()).forEach(function (view) {
            if (view) {
                view.cssClasses.delete(cssClass);
            }
        });
    };
    A11YCssClassHelper.prototype.addCssClass = function (cssClass) {
        system_classes_1.pushToRootViewCssClasses(cssClass);
        __spread([nsApp.getRootView()], this.getModalViews()).forEach(function (view) {
            if (view) {
                view.cssClasses.add(cssClass);
            }
        });
    };
    A11YCssClassHelper.prototype.updateCurrentHelperClasses = function () {
        var _a = this.fontScaleObservable, fontScale = _a.fontScale, isExtraSmall = _a.isExtraSmall, isExtraLarge = _a.isExtraLarge;
        var changed = false;
        var oldFontScaleClass = this.currentFontScaleClass;
        if (this.fontScaleCssClasses.has(fontScale)) {
            this.currentFontScaleClass = this.fontScaleCssClasses.get(fontScale);
        }
        else {
            this.currentFontScaleClass = this.fontScaleCssClasses.get(1);
        }
        if (oldFontScaleClass !== this.currentFontScaleClass) {
            this.removeCssClass(oldFontScaleClass);
            this.addCssClass(this.currentFontScaleClass);
            changed = true;
        }
        var oldActiveFontScaleCategory = this.currentFontScaleCategory;
        if (platform_1.isAndroid) {
            this.currentFontScaleCategory = fontExtraMediumClass;
        }
        else {
            if (isExtraSmall) {
                this.currentFontScaleCategory = fontExtraSmallClass;
            }
            else if (isExtraLarge) {
                this.currentFontScaleCategory = fontExtraLargeClass;
            }
            else {
                this.currentFontScaleCategory = fontExtraMediumClass;
            }
        }
        if (oldActiveFontScaleCategory !== this.currentFontScaleCategory) {
            this.removeCssClass(oldActiveFontScaleCategory);
            this.addCssClass(this.currentFontScaleCategory);
            changed = true;
        }
        var oldA11YStatusClass = this.currentA11YStatusClass;
        if (this.a11yServiceObservable.accessibilityServiceEnabled) {
            this.currentA11YStatusClass = a11yServiceEnabledClass;
        }
        else {
            this.currentA11YStatusClass = a11yServiceDisabledClass;
        }
        if (oldA11YStatusClass !== this.currentA11YStatusClass) {
            this.removeCssClass(oldA11YStatusClass);
            this.addCssClass(this.currentA11YStatusClass);
            changed = true;
        }
        if (this.currentRootA11YClass !== rootA11YClass) {
            this.addCssClass(rootA11YClass);
            this.currentRootA11YClass = rootA11YClass;
            changed = true;
        }
        return changed;
    };
    A11YCssClassHelper.prototype.fontScaleChanged = function (event) {
        var fontScale = this.fontScaleObservable.fontScale;
        if (trace_1.isTraceEnabled()) {
            trace_1.writeFontScaleTrace(this.cls + ".fontScaleChanged(): " + FontScaleObservable_1.FontScaleObservable.FONT_SCALE + " changed to " + fontScale);
        }
        this.updateRootViews(event);
    };
    A11YCssClassHelper.prototype.a11yServiceChanged = function (event) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeFontScaleTrace(this.cls + ".a11yServiceChanged(): to " + this.a11yServiceObservable.accessibilityServiceEnabled);
        }
        this.updateRootViews(event);
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "updateRootViews", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "getModalViews", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [view_1.View]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "addModalViewRef", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "removeCssClass", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "addCssClass", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Boolean)
    ], A11YCssClassHelper.prototype, "updateCurrentHelperClasses", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "fontScaleChanged", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], A11YCssClassHelper.prototype, "a11yServiceChanged", null);
    return A11YCssClassHelper;
}());
exports.cssClassHelper = new A11YCssClassHelper();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLWNsYXNzZXMtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3NzLWNsYXNzZXMtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0VBQW9FO0FBQ3BFLHdFQUF1RztBQUV2Ryx3REFBd0Q7QUFDeEQsMERBQXVEO0FBQ3ZELHdEQUF1RDtBQUN2RCxrQ0FBMkU7QUFDM0Usb0VBQW1FO0FBQ25FLGtDQUFnQztBQUNoQyw0Q0FBaUQ7QUFDakQsd0NBQXVFO0FBQ3ZFLGtEQUFnRDtBQUdoRCxJQUFNLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0FBQ2hELElBQU0sb0JBQW9CLEdBQUcsa0JBQWtCLENBQUM7QUFDaEQsSUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUNoRCxJQUFNLHVCQUF1QixHQUFHLHNCQUFzQixDQUFDO0FBQ3ZELElBQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7QUFDekQsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBRWhDO0lBb0JFO1FBQUEsaUJBWUM7UUEvQmdCLFFBQUcsR0FBRyxrQkFBa0IsQ0FBQztRQUV6Qix3QkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyx5Q0FBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxDQUFDLEVBQUUsRUFBRSxvQkFBa0IsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFHLENBQUMsRUFBckQsQ0FBcUQsQ0FBQyxDQUFDLENBQUM7UUFFakosMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLDZCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUM5QiwyQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFDNUIseUJBQW9CLEdBQUcsRUFBRSxDQUFDO1FBRWpCLHdCQUFtQixHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUNoRCwwQkFBcUIsR0FBRyxJQUFJLDZDQUFxQyxF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O0lBR0Q7UUFEQyxtQkFBTzs7Ozs0REFTUDtJQUdEO1FBREMsbUJBQU87Ozs7eURBU1A7SUFPRDtRQURDLG1CQUFPOzs7O3dFQThEUDtJQUdEO1FBREMsbUJBQU87Ozs7OERBUVA7SUFHRDtRQURDLG1CQUFPOzs7O2dFQU9QO0lBQ0gseUJBQUM7Q0FBQSxBQWxORCxJQWtOQztBQUVZLFFBQUEsY0FBYyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvcmUvdmlldy5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgbnNBcHAgZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IHB1c2hUb1Jvb3RWaWV3Q3NzQ2xhc3NlcywgcmVtb3ZlU3lzdGVtQ3NzQ2xhc3MgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvY3NzL3N5c3RlbS1jbGFzc2VzJztcbmltcG9ydCB7IFByb3BlcnR5Q2hhbmdlRGF0YSB9IGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS9kYXRhL29ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBbmRyb2lkIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3BsYXRmb3JtJztcbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvdWkvY29yZS92aWV3JztcbmltcG9ydCB7IGlzVHJhY2VFbmFibGVkLCB3cml0ZUZvbnRTY2FsZVRyYWNlLCB3cml0ZVRyYWNlIH0gZnJvbSAnLi4vdHJhY2UnO1xuaW1wb3J0IHsgRm9udFNjYWxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWxzL0ZvbnRTY2FsZU9ic2VydmFibGUnO1xuaW1wb3J0ICcuLi91dGlscy9nbG9iYWwtZXZlbnRzJztcbmltcG9ydCB7IGhtclNhZmVFdmVudHMgfSBmcm9tICcuLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCB7IEFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlscy91dGlscyc7XG5pbXBvcnQgeyBWaWV3Q29tbW9uIH0gZnJvbSAnLi9jb3JlL3ZpZXctY29tbW9uJztcblxuLy8gQ1NTLWNsYXNzZXNcbmNvbnN0IGZvbnRFeHRyYVNtYWxsQ2xhc3MgPSBgYTExeS1mb250c2NhbGUteHNgO1xuY29uc3QgZm9udEV4dHJhTWVkaXVtQ2xhc3MgPSBgYTExeS1mb250c2NhbGUtbWA7XG5jb25zdCBmb250RXh0cmFMYXJnZUNsYXNzID0gYGExMXktZm9udHNjYWxlLXhsYDtcbmNvbnN0IGExMXlTZXJ2aWNlRW5hYmxlZENsYXNzID0gYGExMXktc2VydmljZS1lbmFibGVkYDtcbmNvbnN0IGExMXlTZXJ2aWNlRGlzYWJsZWRDbGFzcyA9IGBhMTF5LXNlcnZpY2UtZGlzYWJsZWRgO1xuY29uc3Qgcm9vdEExMVlDbGFzcyA9ICducy1hMTF5JztcblxuY2xhc3MgQTExWUNzc0NsYXNzSGVscGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjbHMgPSBgQ3NzQ2xhc3Nlc0hlbHBlcmA7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBmb250U2NhbGVDc3NDbGFzc2VzID0gbmV3IE1hcChGb250U2NhbGVPYnNlcnZhYmxlLlZBTElEX0ZPTlRfU0NBTEVTLm1hcCgoZnMpID0+IFtmcywgYGExMXktZm9udHNjYWxlLSR7TnVtYmVyKGZzICogMTAwKS50b0ZpeGVkKDApfWBdKSk7XG5cbiAgcHJpdmF0ZSBjdXJyZW50Rm9udFNjYWxlQ2xhc3MgPSAnJztcbiAgcHJpdmF0ZSBjdXJyZW50Rm9udFNjYWxlQ2F0ZWdvcnkgPSAnJztcbiAgcHJpdmF0ZSBjdXJyZW50QTExWVN0YXR1c0NsYXNzID0gJyc7XG4gIHByaXZhdGUgY3VycmVudFJvb3RBMTFZQ2xhc3MgPSAnJztcblxuICBwcml2YXRlIHJlYWRvbmx5IGZvbnRTY2FsZU9ic2VydmFibGUgPSBuZXcgRm9udFNjYWxlT2JzZXJ2YWJsZSgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGExMXlTZXJ2aWNlT2JzZXJ2YWJsZSA9IG5ldyBBY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWRPYnNlcnZhYmxlKCk7XG5cbiAgLyoqXG4gICAqIEtlZXAgYSBsaXN0IG9mIFdlYWtSZWZzIHRvIGxvYWRlZCBtb2RhbCB2aWV3cy5cbiAgICpcbiAgICogVGhpcyBpcyBuZWVkZWQgdG8gdHJpZ2dlciBVSSB1cGRhdGVzIGlmIHRoZSBmb250c2NhbGUgb3IgYTExeS1zZXJ2aWNlIHN0YXR1cyBjaGFuZ2VzXG4gICAqKi9cbiAgcHJpdmF0ZSBsb2FkZWRNb2RhbFZpZXdSZWZzID0gbmV3IE1hcDxzdHJpbmcsIFdlYWtSZWY8Vmlldz4+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb250U2NhbGVPYnNlcnZhYmxlLm9uKEZvbnRTY2FsZU9ic2VydmFibGUucHJvcGVydHlDaGFuZ2VFdmVudCwgdGhpcy5mb250U2NhbGVDaGFuZ2VkLCB0aGlzKTtcbiAgICB0aGlzLmExMXlTZXJ2aWNlT2JzZXJ2YWJsZS5vbihBY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWRPYnNlcnZhYmxlLnByb3BlcnR5Q2hhbmdlRXZlbnQsIHRoaXMuYTExeVNlcnZpY2VDaGFuZ2VkLCB0aGlzKTtcblxuICAgIC8vIE92ZXJyaWRlIGdsb2JhbCBldmVudHNcbiAgICBobXJTYWZlRXZlbnRzKGAke3RoaXMuY2xzfS51cGRhdGVSb290Vmlld3NgLCBbbnNBcHAuZGlzcGxheWVkRXZlbnQsIG5zQXBwLnJlc3VtZUV2ZW50XSwgbnNBcHAsIChldnQpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlUm9vdFZpZXdzKGV2dCk7XG4gICAgfSk7XG5cbiAgICBobXJTYWZlRXZlbnRzKGAke3RoaXMuY2xzfS5tb2RhbFZpZXdTaG93aW5nYCwgW1ZpZXcuc2hvd25Nb2RhbGx5RXZlbnRdLCBWaWV3Q29tbW9uLCAoZXZ0KSA9PiB7XG4gICAgICB0aGlzLmFkZE1vZGFsVmlld1JlZihldnQub2JqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgY3NzLWhlbHBlciBjbGFzc2VzIG9uIHJvb3QgYW5kIG1vZGFsLXZpZXdzXG4gICAqL1xuICBAcHJvZmlsZVxuICBwcml2YXRlIHVwZGF0ZVJvb3RWaWV3cyhldnQ/OiBhbnkpIHtcbiAgICBldnQgPSB7IC4uLmV2dCB9O1xuXG4gICAgY29uc3QgY2xzID0gYCR7dGhpcy5jbHN9LnVwZGF0ZVJvb3RWaWV3cyh7ZXZlbnROYW1lOiAke2V2dC5ldmVudE5hbWV9LCBvYmplY3Q6ICR7ZXZ0Lm9iamVjdH19KWA7XG4gICAgaWYgKCF0aGlzLnVwZGF0ZUN1cnJlbnRIZWxwZXJDbGFzc2VzKCkpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIG5vIGNoYW5nZXNgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdmlldyBvZiBbbnNBcHAuZ2V0Um9vdFZpZXcoKSwgLi4udGhpcy5nZXRNb2RhbFZpZXdzKCldKSB7XG4gICAgICBpZiAoIXZpZXcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIHVwZGF0ZSBjc3Mgc3RhdGUgb24gJHt2aWV3fWApO1xuICAgICAgfVxuXG4gICAgICB2aWV3Ll9vbkNzc1N0YXRlQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2FkZWQgbW9kYWwgdmlld3NcbiAgICovXG4gIEBwcm9maWxlXG4gIHByaXZhdGUgZ2V0TW9kYWxWaWV3cygpIHtcbiAgICBjb25zdCB2aWV3cyA9IFtdIGFzIFZpZXdbXTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgdmlld1JlZl0gb2YgdGhpcy5sb2FkZWRNb2RhbFZpZXdSZWZzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdmlld1JlZi5nZXQoKTtcbiAgICAgIGlmICghdmlldykge1xuICAgICAgICAvLyBUaGlzIHZpZXcgZG9lc24ndCBleGlzdHMgYW55bW9yZSwgcmVtb3ZlIHRoZSBXZWFrUmVmIGZyb20gdGhlIHNldC5cbiAgICAgICAgdGhpcy5sb2FkZWRNb2RhbFZpZXdSZWZzLmRlbGV0ZShpZCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2aWV3cy5wdXNoKHZpZXcpO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3cztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbW9kYWwgdmlldyB0byBsaXN0IGxvYWRlZCBtb2RhbHMuXG4gICAqXG4gICAqIFRoZXNlIGFyZSB1c2VkIHRvIHRoZSBVSSBpZiBmb250c2NhbGUgb3IgdGhlIGExMXktc2VydmljZSBzdGF0dXMgY2hhbmdlcyB3aGlsZSB0aGUgbW9kYWwgaXMgYWN0aXZlLlxuICAgKi9cbiAgQHByb2ZpbGVcbiAgcHJpdmF0ZSBhZGRNb2RhbFZpZXdSZWYobW9kYWxWaWV3OiBWaWV3KSB7XG4gICAgZm9yIChjb25zdCBbaWQsIHZpZXdSZWZdIG9mIHRoaXMubG9hZGVkTW9kYWxWaWV3UmVmcykge1xuICAgICAgY29uc3Qgb3RoZXJWaWV3ID0gdmlld1JlZi5nZXQoKTtcbiAgICAgIGlmICghb3RoZXJWaWV3KSB7XG4gICAgICAgIC8vIFRoaXMgdmlldyBkb2Vzbid0IGV4aXN0cyBhbnltb3JlLCByZW1vdmUgdGhlIFdlYWtSZWYgZnJvbSB0aGUgc2V0LlxuICAgICAgICB0aGlzLmxvYWRlZE1vZGFsVmlld1JlZnMuZGVsZXRlKGlkKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkZWRNb2RhbFZpZXdSZWZzLnNldChgJHttb2RhbFZpZXd9YCwgbmV3IFdlYWtSZWYobW9kYWxWaWV3KSk7XG4gIH1cblxuICBAcHJvZmlsZVxuICBwcml2YXRlIHJlbW92ZUNzc0NsYXNzKGNzc0NsYXNzOiBzdHJpbmcpIHtcbiAgICByZW1vdmVTeXN0ZW1Dc3NDbGFzcyhjc3NDbGFzcyk7XG5cbiAgICBbbnNBcHAuZ2V0Um9vdFZpZXcoKSwgLi4udGhpcy5nZXRNb2RhbFZpZXdzKCldLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgIHZpZXcuY3NzQ2xhc3Nlcy5kZWxldGUoY3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQHByb2ZpbGVcbiAgcHJpdmF0ZSBhZGRDc3NDbGFzcyhjc3NDbGFzczogc3RyaW5nKSB7XG4gICAgcHVzaFRvUm9vdFZpZXdDc3NDbGFzc2VzKGNzc0NsYXNzKTtcblxuICAgIFtuc0FwcC5nZXRSb290VmlldygpLCAuLi50aGlzLmdldE1vZGFsVmlld3MoKV0uZm9yRWFjaCgodmlldykgPT4ge1xuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgdmlldy5jc3NDbGFzc2VzLmFkZChjc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBoZWxwZXIgQ1NTLWNsYXNzZXMuXG4gICAqIFJldHVybiB0cnVlIGlzIGFueSBjaGFuZ2VzLlxuICAgKi9cbiAgQHByb2ZpbGVcbiAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50SGVscGVyQ2xhc3NlcygpOiBib29sZWFuIHtcbiAgICBjb25zdCB7IGZvbnRTY2FsZSwgaXNFeHRyYVNtYWxsLCBpc0V4dHJhTGFyZ2UgfSA9IHRoaXMuZm9udFNjYWxlT2JzZXJ2YWJsZTtcblxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBjb25zdCBvbGRGb250U2NhbGVDbGFzcyA9IHRoaXMuY3VycmVudEZvbnRTY2FsZUNsYXNzO1xuICAgIGlmICh0aGlzLmZvbnRTY2FsZUNzc0NsYXNzZXMuaGFzKGZvbnRTY2FsZSkpIHtcbiAgICAgIHRoaXMuY3VycmVudEZvbnRTY2FsZUNsYXNzID0gdGhpcy5mb250U2NhbGVDc3NDbGFzc2VzLmdldChmb250U2NhbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRGb250U2NhbGVDbGFzcyA9IHRoaXMuZm9udFNjYWxlQ3NzQ2xhc3Nlcy5nZXQoMSk7XG4gICAgfVxuXG4gICAgaWYgKG9sZEZvbnRTY2FsZUNsYXNzICE9PSB0aGlzLmN1cnJlbnRGb250U2NhbGVDbGFzcykge1xuICAgICAgdGhpcy5yZW1vdmVDc3NDbGFzcyhvbGRGb250U2NhbGVDbGFzcyk7XG4gICAgICB0aGlzLmFkZENzc0NsYXNzKHRoaXMuY3VycmVudEZvbnRTY2FsZUNsYXNzKTtcblxuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbGV0IG9sZEFjdGl2ZUZvbnRTY2FsZUNhdGVnb3J5ID0gdGhpcy5jdXJyZW50Rm9udFNjYWxlQ2F0ZWdvcnk7XG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5jdXJyZW50Rm9udFNjYWxlQ2F0ZWdvcnkgPSBmb250RXh0cmFNZWRpdW1DbGFzcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzRXh0cmFTbWFsbCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRGb250U2NhbGVDYXRlZ29yeSA9IGZvbnRFeHRyYVNtYWxsQ2xhc3M7XG4gICAgICB9IGVsc2UgaWYgKGlzRXh0cmFMYXJnZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRGb250U2NhbGVDYXRlZ29yeSA9IGZvbnRFeHRyYUxhcmdlQ2xhc3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRGb250U2NhbGVDYXRlZ29yeSA9IGZvbnRFeHRyYU1lZGl1bUNsYXNzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvbGRBY3RpdmVGb250U2NhbGVDYXRlZ29yeSAhPT0gdGhpcy5jdXJyZW50Rm9udFNjYWxlQ2F0ZWdvcnkpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ3NzQ2xhc3Mob2xkQWN0aXZlRm9udFNjYWxlQ2F0ZWdvcnkpO1xuICAgICAgdGhpcy5hZGRDc3NDbGFzcyh0aGlzLmN1cnJlbnRGb250U2NhbGVDYXRlZ29yeSk7XG5cbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZEExMVlTdGF0dXNDbGFzcyA9IHRoaXMuY3VycmVudEExMVlTdGF0dXNDbGFzcztcbiAgICBpZiAodGhpcy5hMTF5U2VydmljZU9ic2VydmFibGUuYWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBMTFZU3RhdHVzQ2xhc3MgPSBhMTF5U2VydmljZUVuYWJsZWRDbGFzcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50QTExWVN0YXR1c0NsYXNzID0gYTExeVNlcnZpY2VEaXNhYmxlZENsYXNzO1xuICAgIH1cblxuICAgIGlmIChvbGRBMTFZU3RhdHVzQ2xhc3MgIT09IHRoaXMuY3VycmVudEExMVlTdGF0dXNDbGFzcykge1xuICAgICAgdGhpcy5yZW1vdmVDc3NDbGFzcyhvbGRBMTFZU3RhdHVzQ2xhc3MpO1xuICAgICAgdGhpcy5hZGRDc3NDbGFzcyh0aGlzLmN1cnJlbnRBMTFZU3RhdHVzQ2xhc3MpO1xuXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50Um9vdEExMVlDbGFzcyAhPT0gcm9vdEExMVlDbGFzcykge1xuICAgICAgdGhpcy5hZGRDc3NDbGFzcyhyb290QTExWUNsYXNzKTtcbiAgICAgIHRoaXMuY3VycmVudFJvb3RBMTFZQ2xhc3MgPSByb290QTExWUNsYXNzO1xuXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlZDtcbiAgfVxuXG4gIEBwcm9maWxlXG4gIHByaXZhdGUgZm9udFNjYWxlQ2hhbmdlZChldmVudDogUHJvcGVydHlDaGFuZ2VEYXRhKSB7XG4gICAgY29uc3QgeyBmb250U2NhbGUgfSA9IHRoaXMuZm9udFNjYWxlT2JzZXJ2YWJsZTtcbiAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgd3JpdGVGb250U2NhbGVUcmFjZShgJHt0aGlzLmNsc30uZm9udFNjYWxlQ2hhbmdlZCgpOiAke0ZvbnRTY2FsZU9ic2VydmFibGUuRk9OVF9TQ0FMRX0gY2hhbmdlZCB0byAke2ZvbnRTY2FsZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJvb3RWaWV3cyhldmVudCk7XG4gIH1cblxuICBAcHJvZmlsZVxuICBwcml2YXRlIGExMXlTZXJ2aWNlQ2hhbmdlZChldmVudDogUHJvcGVydHlDaGFuZ2VEYXRhKSB7XG4gICAgaWYgKGlzVHJhY2VFbmFibGVkKCkpIHtcbiAgICAgIHdyaXRlRm9udFNjYWxlVHJhY2UoYCR7dGhpcy5jbHN9LmExMXlTZXJ2aWNlQ2hhbmdlZCgpOiB0byAke3RoaXMuYTExeVNlcnZpY2VPYnNlcnZhYmxlLmFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJvb3RWaWV3cyhldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNzc0NsYXNzSGVscGVyID0gbmV3IEExMVlDc3NDbGFzc0hlbHBlcigpO1xuIl19