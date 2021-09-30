"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nsApp = require("@nativescript/core/application");
var profiling_1 = require("@nativescript/core/profiling");
var rxjs_1 = require("rxjs");
var utils_1 = require("../../utils/utils");
var A11yServiceEnabledObservable = (function (_super) {
    __extends(A11yServiceEnabledObservable, _super);
    function A11yServiceEnabledObservable() {
        var _this = _super.call(this, utils_1.isAccessibilityServiceEnabled()) || this;
        _this.tnsObs = new utils_1.AccessibilityServiceEnabledObservable();
        nsApp.on(nsApp.resumeEvent, _this.resumeEvent, _this);
        _this.tnsObs.on(utils_1.AccessibilityServiceEnabledObservable.propertyChangeEvent, _this.tnsPropertyValueChanged, _this);
        return _this;
    }
    A11yServiceEnabledObservable.prototype.ngOnDestroy = function () {
        nsApp.off(nsApp.resumeEvent, this.resumeEvent, this);
        this.tnsObs.off(utils_1.AccessibilityServiceEnabledObservable.propertyChangeEvent, this.tnsPropertyValueChanged, this);
        this.resumeEvent = null;
        this.tnsObs = null;
    };
    A11yServiceEnabledObservable.prototype.resumeEvent = function () {
        this.next(utils_1.isAccessibilityServiceEnabled());
    };
    A11yServiceEnabledObservable.prototype.tnsPropertyValueChanged = function (evt) {
        this.next(!!this.tnsObs.accessibilityServiceEnabled);
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], A11yServiceEnabledObservable.prototype, "resumeEvent", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], A11yServiceEnabledObservable.prototype, "tnsPropertyValueChanged", null);
    A11yServiceEnabledObservable = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], A11yServiceEnabledObservable);
    return A11yServiceEnabledObservable;
}(rxjs_1.BehaviorSubject));
exports.A11yServiceEnabledObservable = A11yServiceEnabledObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYTExeS1zZXJ2aWNlLWVuYWJsZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhMTF5LXNlcnZpY2UtZW5hYmxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzRDtBQUN0RCxzREFBd0Q7QUFFeEQsMERBQXVEO0FBQ3ZELDZCQUF1QztBQUN2QywyQ0FBeUc7QUFHekc7SUFBa0QsZ0RBQXdCO0lBR3hFO1FBQUEsWUFDRSxrQkFBTSxxQ0FBNkIsRUFBRSxDQUFDLFNBS3ZDO1FBUk8sWUFBTSxHQUFHLElBQUksNkNBQXFDLEVBQUUsQ0FBQztRQUszRCxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztRQUVwRCxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyw2Q0FBcUMsQ0FBQyxtQkFBbUIsRUFBRSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLENBQUM7O0lBQ2hILENBQUM7SUFFTSxrREFBVyxHQUFsQjtRQUNFLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUFxQyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBR08sa0RBQVcsR0FBbkI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLHFDQUE2QixFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBR08sOERBQXVCLEdBQS9CLFVBQWdDLEdBQXVCO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBUEQ7UUFEQyxtQkFBTzs7OzttRUFHUDtJQUdEO1FBREMsbUJBQU87Ozs7K0VBR1A7SUExQlUsNEJBQTRCO1FBRHhDLGlCQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUM7O09BQ3RCLDRCQUE0QixDQTJCeEM7SUFBRCxtQ0FBQztDQUFBLEFBM0JELENBQWtELHNCQUFlLEdBMkJoRTtBQTNCWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIG5zQXBwIGZyb20gJ0BuYXRpdmVzY3JpcHQvY29yZS9hcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBQcm9wZXJ0eUNoYW5nZURhdGEgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvZGF0YS9vYnNlcnZhYmxlJztcbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkT2JzZXJ2YWJsZSwgaXNBY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWQgfSBmcm9tICcuLi8uLi91dGlscy91dGlscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgQTExeVNlcnZpY2VFbmFibGVkT2JzZXJ2YWJsZSBleHRlbmRzIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdG5zT2JzID0gbmV3IEFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZE9ic2VydmFibGUoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihpc0FjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZCgpKTtcblxuICAgIG5zQXBwLm9uKG5zQXBwLnJlc3VtZUV2ZW50LCB0aGlzLnJlc3VtZUV2ZW50LCB0aGlzKTtcblxuICAgIHRoaXMudG5zT2JzLm9uKEFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZE9ic2VydmFibGUucHJvcGVydHlDaGFuZ2VFdmVudCwgdGhpcy50bnNQcm9wZXJ0eVZhbHVlQ2hhbmdlZCwgdGhpcyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgbnNBcHAub2ZmKG5zQXBwLnJlc3VtZUV2ZW50LCB0aGlzLnJlc3VtZUV2ZW50LCB0aGlzKTtcbiAgICB0aGlzLnRuc09icy5vZmYoQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkT2JzZXJ2YWJsZS5wcm9wZXJ0eUNoYW5nZUV2ZW50LCB0aGlzLnRuc1Byb3BlcnR5VmFsdWVDaGFuZ2VkLCB0aGlzKTtcbiAgICB0aGlzLnJlc3VtZUV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLnRuc09icyA9IG51bGw7XG4gIH1cblxuICBAcHJvZmlsZVxuICBwcml2YXRlIHJlc3VtZUV2ZW50KCkge1xuICAgIHRoaXMubmV4dChpc0FjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZCgpKTtcbiAgfVxuXG4gIEBwcm9maWxlXG4gIHByaXZhdGUgdG5zUHJvcGVydHlWYWx1ZUNoYW5nZWQoZXZ0OiBQcm9wZXJ0eUNoYW5nZURhdGEpIHtcbiAgICB0aGlzLm5leHQoISF0aGlzLnRuc09icy5hY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWQpO1xuICB9XG59XG4iXX0=