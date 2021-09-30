"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var BaseService = (function () {
    function BaseService() {
        this.isDeleted = false;
        this.destroy$ = new rxjs_1.ReplaySubject(1);
    }
    BaseService.prototype.ngOnDestroy = function () {
        var e_1, _a;
        this.destroy$.next(true);
        this.isDeleted = true;
        try {
            for (var _b = __values(Object.entries(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (!value) {
                    continue;
                }
                if (value instanceof core_1.ElementRef) {
                    delete this[key];
                    continue;
                }
                if (value instanceof rxjs_1.Subscription) {
                    try {
                        value.unsubscribe();
                    }
                    catch (_e) {
                    }
                    delete this[key];
                    continue;
                }
                if (value instanceof rxjs_1.Observable) {
                    if (key === 'destroy$') {
                        continue;
                    }
                    delete this[key];
                    continue;
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
    };
    BaseService.prototype.takeUntilDestroy = function () {
        var destroy$ = this.destroy$;
        return function (source) {
            return new rxjs_1.Observable(function (subscriber) {
                var sub = source.subscribe(subscriber);
                var destroySub = destroy$.subscribe(function () {
                    if (sub) {
                        sub.unsubscribe();
                    }
                    if (subscriber) {
                        subscriber.complete();
                    }
                    if (destroySub) {
                        destroySub.unsubscribe();
                    }
                });
                return function () {
                    sub.unsubscribe();
                    destroySub.unsubscribe();
                };
            });
        };
    };
    BaseService.prototype.timerUnlessDestroyed = function (cb, delay) {
        if (delay === void 0) { delay = 0; }
        return rxjs_1.timer(delay)
            .pipe(this.takeUntilDestroy())
            .subscribe(function () {
            try {
                cb();
            }
            catch (_a) {
            }
        });
    };
    return BaseService;
}());
exports.BaseService = BaseService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNEO0FBQ3RELDZCQUFzRTtBQUV0RTtJQUFBO1FBQ1ksY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVaLGFBQVEsR0FBRyxJQUFJLG9CQUFhLENBQVUsQ0FBQyxDQUFDLENBQUM7SUFzRjNELENBQUM7SUFwRlEsaUNBQVcsR0FBbEI7O1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O1lBR3RCLEtBQTJCLElBQUEsS0FBQSxTQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQXRDLElBQUEsd0JBQVksRUFBWCxXQUFHLEVBQUUsYUFBSztnQkFDcEIsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDVixTQUFTO2lCQUNWO2dCQUVELElBQUksS0FBSyxZQUFZLGlCQUFVLEVBQUU7b0JBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixTQUFTO2lCQUNWO2dCQUVELElBQUksS0FBSyxZQUFZLG1CQUFZLEVBQUU7b0JBQ2pDLElBQUk7d0JBQ0YsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3FCQUNyQjtvQkFBQyxXQUFNO3FCQUVQO29CQUVELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixTQUFTO2lCQUNWO2dCQUVELElBQUksS0FBSyxZQUFZLGlCQUFVLEVBQUU7b0JBRS9CLElBQUksR0FBRyxLQUFLLFVBQVUsRUFBRTt3QkFDdEIsU0FBUztxQkFDVjtvQkFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDakIsU0FBUztpQkFDVjthQUNGOzs7Ozs7Ozs7SUFDSCxDQUFDO0lBRU0sc0NBQWdCLEdBQXZCO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUcvQixPQUFPLFVBQVMsTUFBcUI7WUFDbkMsT0FBTyxJQUFJLGlCQUFVLENBQUksVUFBUyxVQUFVO2dCQUMxQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUV6QyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO29CQUdwQyxJQUFJLEdBQUcsRUFBRTt3QkFDUCxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7cUJBQ25CO29CQUVELElBQUksVUFBVSxFQUFFO3dCQUNkLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDdkI7b0JBRUQsSUFBSSxVQUFVLEVBQUU7d0JBQ2QsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO3FCQUMxQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPO29CQUNMLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbEIsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUM7SUFLUywwQ0FBb0IsR0FBOUIsVUFBK0IsRUFBYyxFQUFFLEtBQVM7UUFBVCxzQkFBQSxFQUFBLFNBQVM7UUFDdEQsT0FBTyxZQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUM3QixTQUFTLENBQUM7WUFDVCxJQUFJO2dCQUNGLEVBQUUsRUFBRSxDQUFDO2FBQ047WUFBQyxXQUFNO2FBRVA7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF6RkQsSUF5RkM7QUF6Rlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QsIFN1YnNjcmlwdGlvbiwgdGltZXIgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGNsYXNzIEJhc2VTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIGlzRGVsZXRlZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyByZWFkb25seSBkZXN0cm95JCA9IG5ldyBSZXBsYXlTdWJqZWN0PGJvb2xlYW4+KDEpO1xuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5pc0RlbGV0ZWQgPSB0cnVlO1xuXG4gICAgLy8gRGVmZXJlbmNlIG1lbWJlciB2YXJpYWJsZXMgdG8gYXZvaWQgbGVha3NcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzKSkge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudFJlZikge1xuICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICAvLyBSZW1vdmUgb2JzZXJ2YWJsZXMuIFRoaXMgc2hvdWxkIGhlbHAgY2xlYXIgdXAgJ3RoaXMnIHJlZmVyZW5jZXMgb24gb3BlcmF0b3JzLlxuICAgICAgICBpZiAoa2V5ID09PSAnZGVzdHJveSQnKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGFrZVVudGlsRGVzdHJveTxUPigpIHtcbiAgICBjb25zdCBkZXN0cm95JCA9IHRoaXMuZGVzdHJveSQ7XG5cbiAgICAvLyBUaGlzIHNob3VsZCBoYXZlIGJlZW4gYSBgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpYCBidXQgaXQga2VwdCBlbWl0dGluZyBhZnRlciBkZXN0cm95Li4uXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KGZ1bmN0aW9uKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3Qgc3ViID0gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcblxuICAgICAgICBjb25zdCBkZXN0cm95U3ViID0gZGVzdHJveSQuc3Vic2NyaWJlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGVcbiAgICAgICAgICAvLyBFeHRyYSBjaGVjayBoZXJlIGJlY2F1c2UgSE1SLW1vZGUgbG9nZ2VkIGVycm9ycyBhYm91dCB0aGVtIG1pc3NpbmdcbiAgICAgICAgICBpZiAoc3ViKSB7XG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3Vic2NyaWJlcikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkZXN0cm95U3ViKSB7XG4gICAgICAgICAgICBkZXN0cm95U3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIGRlc3Ryb3lTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZW1lbnQgZm9yIHNldFRpbWVvdXQoLi4uKSwgdGhhdCB3b24ndCB0cmlnZ2VyIGFmdGVyIHRoZSBjb21wb25lbnQgaGF2ZSBiZWVuIGRlc3Ryb3llZC5cbiAgICovXG4gIHByb3RlY3RlZCB0aW1lclVubGVzc0Rlc3Ryb3llZChjYjogKCkgPT4gdm9pZCwgZGVsYXkgPSAwKSB7XG4gICAgcmV0dXJuIHRpbWVyKGRlbGF5KVxuICAgICAgLnBpcGUodGhpcy50YWtlVW50aWxEZXN0cm95KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjYigpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==