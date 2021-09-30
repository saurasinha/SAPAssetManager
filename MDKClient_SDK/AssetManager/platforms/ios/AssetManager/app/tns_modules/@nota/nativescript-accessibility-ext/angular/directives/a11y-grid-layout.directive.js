"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var profiling_1 = require("@nativescript/core/profiling");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var a11y_font_scaling_1 = require("../data/a11y-font-scaling");
var base_service_1 = require("../services/base.service");
var A11YGridLayoutDirective = (function (_super) {
    __extends(A11YGridLayoutDirective, _super);
    function A11YGridLayoutDirective(el, fontScaling$) {
        var _this = _super.call(this) || this;
        _this.el = el;
        _this.fontScaling$ = fontScaling$;
        _this.rows$ = new rxjs_1.BehaviorSubject(null);
        _this.columns$ = new rxjs_1.BehaviorSubject(null);
        return _this;
    }
    Object.defineProperty(A11YGridLayoutDirective.prototype, "rows", {
        get: function () {
            return this.rows$.value;
        },
        set: function (a11yRows) {
            this.rows$.next("" + a11yRows);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(A11YGridLayoutDirective.prototype, "columns", {
        get: function () {
            return this.columns$.value;
        },
        set: function (a11yColumns) {
            this.columns$.next("" + a11yColumns);
        },
        enumerable: true,
        configurable: true
    });
    A11YGridLayoutDirective.prototype.ngOnInit = function () {
        var _this = this;
        rxjs_1.combineLatest(this.rows$, this.fontScaling$)
            .pipe(operators_1.map(function (_a) {
            var _b = __read(_a, 2), rows = _b[0], fontScale = _b[1];
            return _this.fixValue(rows, fontScale);
        }), operators_1.filter(function (rows) { return !!rows; }), this.takeUntilDestroy())
            .subscribe(function (rows) { return (_this.el.nativeElement['rows'] = rows); });
        rxjs_1.combineLatest(this.columns$, this.fontScaling$)
            .pipe(operators_1.map(function (_a) {
            var _b = __read(_a, 2), columns = _b[0], fontScale = _b[1];
            return _this.fixValue(columns, fontScale);
        }), operators_1.filter(function (columns) { return !!columns; }), this.takeUntilDestroy())
            .subscribe(function (columns) { return (_this.el.nativeElement['columns'] = columns); });
    };
    A11YGridLayoutDirective.prototype.fixValue = function (str, fontScale) {
        if (!str) {
            return null;
        }
        return str
            .split(',')
            .map(function (part) { return ("" + part).trim().toLowerCase(); })
            .filter(function (part) { return !!part; })
            .map(function (part) {
            switch (part) {
                case '*':
                case 'auto': {
                    return part;
                }
                default: {
                    return Number(part) * fontScale;
                }
            }
        })
            .join(', ');
    };
    __decorate([
        core_1.Input('a11yRows'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], A11YGridLayoutDirective.prototype, "rows", null);
    __decorate([
        core_1.Input('a11yColumns'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], A11YGridLayoutDirective.prototype, "columns", null);
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Number]),
        __metadata("design:returntype", void 0)
    ], A11YGridLayoutDirective.prototype, "fixValue", null);
    A11YGridLayoutDirective = __decorate([
        core_1.Directive({
            selector: 'GridLayout[a11yRows], GridLayout[a11yColumns]',
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, a11y_font_scaling_1.A11yFontScalingObservable])
    ], A11YGridLayoutDirective);
    return A11YGridLayoutDirective;
}(base_service_1.BaseService));
exports.A11YGridLayoutDirective = A11YGridLayoutDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYTExeS1ncmlkLWxheW91dC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhMTF5LWdyaWQtbGF5b3V0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFxRTtBQUNyRSwwREFBdUQ7QUFFdkQsNkJBQXNEO0FBQ3RELDRDQUE2QztBQUM3QywrREFBc0U7QUFDdEUseURBQXVEO0FBS3ZEO0lBQTZDLDJDQUFXO0lBbUJ0RCxpQ0FBNkIsRUFBMEIsRUFBbUIsWUFBdUM7UUFBakgsWUFDRSxpQkFBTyxTQUNSO1FBRjRCLFFBQUUsR0FBRixFQUFFLENBQXdCO1FBQW1CLGtCQUFZLEdBQVosWUFBWSxDQUEyQjtRQWxCaEcsV0FBSyxHQUFHLElBQUksc0JBQWUsQ0FBUyxJQUFJLENBQUMsQ0FBQztRQVMxQyxjQUFRLEdBQUcsSUFBSSxzQkFBZSxDQUFTLElBQUksQ0FBQyxDQUFDOztJQVc5RCxDQUFDO0lBbEJELHNCQUFXLHlDQUFJO2FBR2Y7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLENBQUM7YUFMRCxVQUFnQixRQUFnQjtZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFHLFFBQVUsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBT0Qsc0JBQVcsNENBQU87YUFHbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzdCLENBQUM7YUFMRCxVQUFtQixXQUFtQjtZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFHLFdBQWEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7OztPQUFBO0lBU00sMENBQVEsR0FBZjtRQUFBLGlCQWdCQztRQWZDLG9CQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQ3pDLElBQUksQ0FDSCxlQUFHLENBQUMsVUFBQyxFQUFpQjtnQkFBakIsa0JBQWlCLEVBQWhCLFlBQUksRUFBRSxpQkFBUztZQUFNLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1FBQTlCLENBQThCLENBQUMsRUFDMUQsa0JBQU0sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLEVBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUN4QjthQUNBLFNBQVMsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztRQUUvRCxvQkFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQzthQUM1QyxJQUFJLENBQ0gsZUFBRyxDQUFDLFVBQUMsRUFBb0I7Z0JBQXBCLGtCQUFvQixFQUFuQixlQUFPLEVBQUUsaUJBQVM7WUFBTSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztRQUFqQyxDQUFpQyxDQUFDLEVBQ2hFLGtCQUFNLENBQUMsVUFBQyxPQUFPLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxFQUM5QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FDeEI7YUFDQSxTQUFTLENBQUMsVUFBQyxPQUFPLElBQUssT0FBQSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUdPLDBDQUFRLEdBQWhCLFVBQWlCLEdBQVcsRUFBRSxTQUFpQjtRQUM3QyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sR0FBRzthQUNQLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFBLEtBQUcsSUFBTSxDQUFBLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQTlCLENBQThCLENBQUM7YUFDN0MsTUFBTSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUM7YUFDeEIsR0FBRyxDQUFDLFVBQUMsSUFBSTtZQUNSLFFBQVEsSUFBSSxFQUFFO2dCQUNaLEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssTUFBTSxDQUFDLENBQUM7b0JBQ1gsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO2lCQUNqQzthQUNGO1FBQ0gsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUE1REQ7UUFEQyxZQUFLLENBQUMsVUFBVSxDQUFDOzs7dURBR2pCO0lBT0Q7UUFEQyxZQUFLLENBQUMsYUFBYSxDQUFDOzs7MERBR3BCO0lBNEJEO1FBREMsbUJBQU87Ozs7MkRBc0JQO0lBL0RVLHVCQUF1QjtRQUhuQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLCtDQUErQztTQUMxRCxDQUFDO3lDQW9CaUMsaUJBQVUsRUFBNkMsNkNBQXlCO09BbkJ0Ryx1QkFBdUIsQ0FnRW5DO0lBQUQsOEJBQUM7Q0FBQSxBQWhFRCxDQUE2QywwQkFBVyxHQWdFdkQ7QUFoRVksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBwcm9maWxlIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3Byb2ZpbGluZyc7XG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2xheW91dHMvZ3JpZC1sYXlvdXQvZ3JpZC1sYXlvdXQnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEExMXlGb250U2NhbGluZ09ic2VydmFibGUgfSBmcm9tICcuLi9kYXRhL2ExMXktZm9udC1zY2FsaW5nJztcbmltcG9ydCB7IEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYmFzZS5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnR3JpZExheW91dFthMTF5Um93c10sIEdyaWRMYXlvdXRbYTExeUNvbHVtbnNdJyxcbn0pXG5leHBvcnQgY2xhc3MgQTExWUdyaWRMYXlvdXREaXJlY3RpdmUgZXh0ZW5kcyBCYXNlU2VydmljZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm93cyQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XG4gIEBJbnB1dCgnYTExeVJvd3MnKVxuICBwdWJsaWMgc2V0IHJvd3MoYTExeVJvd3M6IHN0cmluZykge1xuICAgIHRoaXMucm93cyQubmV4dChgJHthMTF5Um93c31gKTtcbiAgfVxuICBwdWJsaWMgZ2V0IHJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cyQudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbnMkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KG51bGwpO1xuICBASW5wdXQoJ2ExMXlDb2x1bW5zJylcbiAgcHVibGljIHNldCBjb2x1bW5zKGExMXlDb2x1bW5zOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbnMkLm5leHQoYCR7YTExeUNvbHVtbnN9YCk7XG4gIH1cbiAgcHVibGljIGdldCBjb2x1bW5zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbnMkLnZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlbDogRWxlbWVudFJlZjxHcmlkTGF5b3V0PiwgcHJpdmF0ZSByZWFkb25seSBmb250U2NhbGluZyQ6IEExMXlGb250U2NhbGluZ09ic2VydmFibGUpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIGNvbWJpbmVMYXRlc3QodGhpcy5yb3dzJCwgdGhpcy5mb250U2NhbGluZyQpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChbcm93cywgZm9udFNjYWxlXSkgPT4gdGhpcy5maXhWYWx1ZShyb3dzLCBmb250U2NhbGUpKSxcbiAgICAgICAgZmlsdGVyKChyb3dzKSA9PiAhIXJvd3MpLFxuICAgICAgICB0aGlzLnRha2VVbnRpbERlc3Ryb3koKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHJvd3MpID0+ICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnRbJ3Jvd3MnXSA9IHJvd3MpKTtcblxuICAgIGNvbWJpbmVMYXRlc3QodGhpcy5jb2x1bW5zJCwgdGhpcy5mb250U2NhbGluZyQpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChbY29sdW1ucywgZm9udFNjYWxlXSkgPT4gdGhpcy5maXhWYWx1ZShjb2x1bW5zLCBmb250U2NhbGUpKSxcbiAgICAgICAgZmlsdGVyKChjb2x1bW5zKSA9PiAhIWNvbHVtbnMpLFxuICAgICAgICB0aGlzLnRha2VVbnRpbERlc3Ryb3koKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGNvbHVtbnMpID0+ICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnRbJ2NvbHVtbnMnXSA9IGNvbHVtbnMpKTtcbiAgfVxuXG4gIEBwcm9maWxlXG4gIHByaXZhdGUgZml4VmFsdWUoc3RyOiBzdHJpbmcsIGZvbnRTY2FsZTogbnVtYmVyKSB7XG4gICAgaWYgKCFzdHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChwYXJ0KSA9PiBgJHtwYXJ0fWAudHJpbSgpLnRvTG93ZXJDYXNlKCkpXG4gICAgICAuZmlsdGVyKChwYXJ0KSA9PiAhIXBhcnQpXG4gICAgICAubWFwKChwYXJ0KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocGFydCkge1xuICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIGNhc2UgJ2F1dG8nOiB7XG4gICAgICAgICAgICByZXR1cm4gcGFydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihwYXJ0KSAqIGZvbnRTY2FsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuam9pbignLCAnKTtcbiAgfVxufVxuIl19