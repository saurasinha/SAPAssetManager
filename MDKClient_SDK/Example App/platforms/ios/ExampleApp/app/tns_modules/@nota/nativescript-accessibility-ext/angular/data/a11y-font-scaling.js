"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var profiling_1 = require("@nativescript/core/profiling");
var rxjs_1 = require("rxjs");
var FontScaleObservable_1 = require("../../utils/FontScaleObservable");
var A11yFontScalingObservable = (function (_super) {
    __extends(A11yFontScalingObservable, _super);
    function A11yFontScalingObservable() {
        var _this = _super.call(this, 1) || this;
        _this.tnsObs = new FontScaleObservable_1.FontScaleObservable();
        _this.tnsObs.on(FontScaleObservable_1.FontScaleObservable.propertyChangeEvent, _this.updateFontScalingValue, _this);
        _this.updateFontScalingValue();
        return _this;
    }
    A11yFontScalingObservable.prototype.ngOnDestroy = function () {
        this.tnsObs.off(FontScaleObservable_1.FontScaleObservable.propertyChangeEvent, this.updateFontScalingValue, this);
        this.tnsObs = null;
    };
    A11yFontScalingObservable.prototype.updateFontScalingValue = function () {
        var fontScale = this.tnsObs.fontScale;
        if (typeof fontScale === 'number' && !isNaN(fontScale)) {
            this.next(fontScale);
        }
        else {
            this.next(1);
        }
    };
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], A11yFontScalingObservable.prototype, "updateFontScalingValue", null);
    A11yFontScalingObservable = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], A11yFontScalingObservable);
    return A11yFontScalingObservable;
}(rxjs_1.BehaviorSubject));
exports.A11yFontScalingObservable = A11yFontScalingObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYTExeS1mb250LXNjYWxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhMTF5LWZvbnQtc2NhbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzRDtBQUN0RCwwREFBdUQ7QUFDdkQsNkJBQXVDO0FBQ3ZDLHVFQUFzRTtBQUd0RTtJQUErQyw2Q0FBdUI7SUFHcEU7UUFBQSxZQUNFLGtCQUFNLENBQUMsQ0FBQyxTQUlUO1FBUE8sWUFBTSxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUt6QyxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyx5Q0FBbUIsQ0FBQyxtQkFBbUIsRUFBRSxLQUFJLENBQUMsc0JBQXNCLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDM0YsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7O0lBQ2hDLENBQUM7SUFFTSwrQ0FBVyxHQUFsQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlDQUFtQixDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBR08sMERBQXNCLEdBQTlCO1FBQ0UsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQVBEO1FBREMsbUJBQU87Ozs7MkVBUVA7SUF2QlUseUJBQXlCO1FBRHJDLGlCQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUM7O09BQ3RCLHlCQUF5QixDQXdCckM7SUFBRCxnQ0FBQztDQUFBLEFBeEJELENBQStDLHNCQUFlLEdBd0I3RDtBQXhCWSw4REFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRm9udFNjYWxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL3V0aWxzL0ZvbnRTY2FsZU9ic2VydmFibGUnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEExMXlGb250U2NhbGluZ09ic2VydmFibGUgZXh0ZW5kcyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdG5zT2JzID0gbmV3IEZvbnRTY2FsZU9ic2VydmFibGUoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigxKTtcblxuICAgIHRoaXMudG5zT2JzLm9uKEZvbnRTY2FsZU9ic2VydmFibGUucHJvcGVydHlDaGFuZ2VFdmVudCwgdGhpcy51cGRhdGVGb250U2NhbGluZ1ZhbHVlLCB0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZUZvbnRTY2FsaW5nVmFsdWUoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnRuc09icy5vZmYoRm9udFNjYWxlT2JzZXJ2YWJsZS5wcm9wZXJ0eUNoYW5nZUV2ZW50LCB0aGlzLnVwZGF0ZUZvbnRTY2FsaW5nVmFsdWUsIHRoaXMpO1xuICAgIHRoaXMudG5zT2JzID0gbnVsbDtcbiAgfVxuXG4gIEBwcm9maWxlXG4gIHByaXZhdGUgdXBkYXRlRm9udFNjYWxpbmdWYWx1ZSgpIHtcbiAgICBjb25zdCBmb250U2NhbGUgPSB0aGlzLnRuc09icy5mb250U2NhbGU7XG4gICAgaWYgKHR5cGVvZiBmb250U2NhbGUgPT09ICdudW1iZXInICYmICFpc05hTihmb250U2NhbGUpKSB7XG4gICAgICB0aGlzLm5leHQoZm9udFNjYWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uZXh0KDEpO1xuICAgIH1cbiAgfVxufVxuIl19