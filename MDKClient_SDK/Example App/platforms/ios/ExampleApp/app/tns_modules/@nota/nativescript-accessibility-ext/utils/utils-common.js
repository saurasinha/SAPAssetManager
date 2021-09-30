"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("@nativescript/core/data/observable");
var profiling_1 = require("@nativescript/core/profiling");
var CommonA11YServiceEnabledObservable = (function (_super) {
    __extends(CommonA11YServiceEnabledObservable, _super);
    function CommonA11YServiceEnabledObservable(sharedA11YObservable) {
        var _this = _super.call(this) || this;
        var ref = new WeakRef(_this);
        var lastValue;
        var callback = profiling_1.profile('SharedA11YObservable.propertyChangeEvent', function () {
            var self = ref && ref.get();
            if (!self) {
                sharedA11YObservable.off(observable_1.Observable.propertyChangeEvent, callback);
                return;
            }
            var newValue = sharedA11YObservable.accessibilityServiceEnabled;
            if (newValue !== lastValue) {
                self.set(exports.AccessibilityServiceEnabledPropName, newValue);
                lastValue = newValue;
            }
        });
        sharedA11YObservable.on(observable_1.Observable.propertyChangeEvent, callback);
        _this.set(exports.AccessibilityServiceEnabledPropName, sharedA11YObservable.accessibilityServiceEnabled);
        return _this;
    }
    return CommonA11YServiceEnabledObservable;
}(observable_1.Observable));
exports.CommonA11YServiceEnabledObservable = CommonA11YServiceEnabledObservable;
exports.AccessibilityServiceEnabledPropName = 'accessibilityServiceEnabled';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbHMtY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUVBQWdFO0FBQ2hFLDBEQUF1RDtBQUt2RDtJQUF3RCxzREFBVTtJQUVoRSw0Q0FBWSxvQkFBMEM7UUFBdEQsWUFDRSxpQkFBTyxTQXNCUjtRQXBCQyxJQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLFNBQWtCLENBQUM7UUFDdkIsSUFBTSxRQUFRLEdBQUcsbUJBQU8sQ0FBQywwQ0FBMEMsRUFBRTtZQUNuRSxJQUFNLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1Qsb0JBQW9CLENBQUMsR0FBRyxDQUFDLHVCQUFVLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRW5FLE9BQU87YUFDUjtZQUVELElBQU0sUUFBUSxHQUFHLG9CQUFvQixDQUFDLDJCQUEyQixDQUFDO1lBQ2xFLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQywyQ0FBbUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEQsU0FBUyxHQUFHLFFBQVEsQ0FBQzthQUN0QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsb0JBQW9CLENBQUMsRUFBRSxDQUFDLHVCQUFVLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFbEUsS0FBSSxDQUFDLEdBQUcsQ0FBQywyQ0FBbUMsRUFBRSxvQkFBb0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztJQUNsRyxDQUFDO0lBQ0gseUNBQUM7QUFBRCxDQUFDLEFBMUJELENBQXdELHVCQUFVLEdBMEJqRTtBQTFCWSxnRkFBa0M7QUE0QmxDLFFBQUEsbUNBQW1DLEdBQUcsNkJBQTZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwcm9maWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3Byb2ZpbGluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2hhcmVkQTExWU9ic2VydmFibGUgZXh0ZW5kcyBPYnNlcnZhYmxlIHtcbiAgcmVhZG9ubHkgYWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkPzogYm9vbGVhbjtcbn1cbmV4cG9ydCBjbGFzcyBDb21tb25BMTFZU2VydmljZUVuYWJsZWRPYnNlcnZhYmxlIGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG4gIHJlYWRvbmx5IGFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3Ioc2hhcmVkQTExWU9ic2VydmFibGU6IFNoYXJlZEExMVlPYnNlcnZhYmxlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHJlZiA9IG5ldyBXZWFrUmVmKHRoaXMpO1xuICAgIGxldCBsYXN0VmFsdWU6IGJvb2xlYW47XG4gICAgY29uc3QgY2FsbGJhY2sgPSBwcm9maWxlKCdTaGFyZWRBMTFZT2JzZXJ2YWJsZS5wcm9wZXJ0eUNoYW5nZUV2ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzZWxmID0gcmVmICYmIHJlZi5nZXQoKTtcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzaGFyZWRBMTFZT2JzZXJ2YWJsZS5vZmYoT2JzZXJ2YWJsZS5wcm9wZXJ0eUNoYW5nZUV2ZW50LCBjYWxsYmFjayk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHNoYXJlZEExMVlPYnNlcnZhYmxlLmFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZDtcbiAgICAgIGlmIChuZXdWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XG4gICAgICAgIHNlbGYuc2V0KEFjY2Vzc2liaWxpdHlTZXJ2aWNlRW5hYmxlZFByb3BOYW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2hhcmVkQTExWU9ic2VydmFibGUub24oT2JzZXJ2YWJsZS5wcm9wZXJ0eUNoYW5nZUV2ZW50LCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLnNldChBY2Nlc3NpYmlsaXR5U2VydmljZUVuYWJsZWRQcm9wTmFtZSwgc2hhcmVkQTExWU9ic2VydmFibGUuYWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgQWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkUHJvcE5hbWUgPSAnYWNjZXNzaWJpbGl0eVNlcnZpY2VFbmFibGVkJztcbiJdfQ==