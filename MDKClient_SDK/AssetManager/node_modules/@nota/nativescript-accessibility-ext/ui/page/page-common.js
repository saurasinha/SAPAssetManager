"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var profiling_1 = require("@nativescript/core/profiling");
var page_1 = require("@nativescript/core/ui/page");
exports.Page = page_1.Page;
var trace_1 = require("../../trace");
require("../../utils/global-events");
var helpers_1 = require("../../utils/helpers");
helpers_1.hmrSafeEvents('PageAnnounce', [page_1.Page.navigatedToEvent], page_1.Page, profiling_1.profile('PageAnnounce<A11Y>.', function (args) {
    var page = args.object;
    if (!page) {
        return;
    }
    var cls = page + " - PageAnnounce";
    if (page_1.Page.disableAnnouncePage) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - disabled globally");
        }
        return;
    }
    if (page.disableAnnouncePage) {
        if (trace_1.isTraceEnabled()) {
            trace_1.writeTrace(cls + " - disabled for " + page);
        }
        return;
    }
    page.accessibilityScreenChanged(!!args.isBackNavigation);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYWdlLWNvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDBEQUF1RDtBQUN2RCxtREFBcUU7QUFvQzVELGVBcENBLFdBQUksQ0FvQ0E7QUFuQ2IscUNBQXlEO0FBQ3pELHFDQUFtQztBQUNuQywrQ0FBb0Q7QUFFcEQsdUJBQWEsQ0FDWCxjQUFjLEVBQ2QsQ0FBQyxXQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFDdkIsV0FBSSxFQUNKLG1CQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBQyxJQUF1QjtJQUNyRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxPQUFPO0tBQ1I7SUFFRCxJQUFNLEdBQUcsR0FBTSxJQUFJLG9CQUFpQixDQUFDO0lBQ3JDLElBQUksV0FBSSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLElBQUksc0JBQWMsRUFBRSxFQUFFO1lBQ3BCLGtCQUFVLENBQUksR0FBRyx5QkFBc0IsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsT0FBTztLQUNSO0lBRUQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxzQkFBYyxFQUFFLEVBQUU7WUFDcEIsa0JBQVUsQ0FBSSxHQUFHLHdCQUFtQixJQUFNLENBQUMsQ0FBQztTQUM3QztRQUVELE9BQU87S0FDUjtJQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDLENBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3BhZ2UuZC50c1wiIC8+XG5cbmltcG9ydCB7IHByb2ZpbGUgfSBmcm9tICdAbmF0aXZlc2NyaXB0L2NvcmUvcHJvZmlsaW5nJztcbmltcG9ydCB7IFBhZ2UsIFBhZ2VOYXZpZ2F0ZWREYXRhIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL3BhZ2UnO1xuaW1wb3J0IHsgaXNUcmFjZUVuYWJsZWQsIHdyaXRlVHJhY2UgfSBmcm9tICcuLi8uLi90cmFjZSc7XG5pbXBvcnQgJy4uLy4uL3V0aWxzL2dsb2JhbC1ldmVudHMnO1xuaW1wb3J0IHsgaG1yU2FmZUV2ZW50cyB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuXG5obXJTYWZlRXZlbnRzKFxuICAnUGFnZUFubm91bmNlJyxcbiAgW1BhZ2UubmF2aWdhdGVkVG9FdmVudF0sXG4gIFBhZ2UsXG4gIHByb2ZpbGUoJ1BhZ2VBbm5vdW5jZTxBMTFZPi4nLCAoYXJnczogUGFnZU5hdmlnYXRlZERhdGEpID0+IHtcbiAgICBjb25zdCBwYWdlID0gYXJncy5vYmplY3Q7XG4gICAgaWYgKCFwYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2xzID0gYCR7cGFnZX0gLSBQYWdlQW5ub3VuY2VgO1xuICAgIGlmIChQYWdlLmRpc2FibGVBbm5vdW5jZVBhZ2UpIHtcbiAgICAgIGlmIChpc1RyYWNlRW5hYmxlZCgpKSB7XG4gICAgICAgIHdyaXRlVHJhY2UoYCR7Y2xzfSAtIGRpc2FibGVkIGdsb2JhbGx5YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFnZS5kaXNhYmxlQW5ub3VuY2VQYWdlKSB7XG4gICAgICBpZiAoaXNUcmFjZUVuYWJsZWQoKSkge1xuICAgICAgICB3cml0ZVRyYWNlKGAke2Nsc30gLSBkaXNhYmxlZCBmb3IgJHtwYWdlfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFnZS5hY2Nlc3NpYmlsaXR5U2NyZWVuQ2hhbmdlZCghIWFyZ3MuaXNCYWNrTmF2aWdhdGlvbik7XG4gIH0pLFxuKTtcblxuZXhwb3J0IHsgUGFnZSB9O1xuIl19