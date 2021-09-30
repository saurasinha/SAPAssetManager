"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var label_1 = require("@nativescript/core/ui/label");
Object.defineProperty(label_1.Label.prototype, 'accessibilityAdjustsFontSize', {
    get: function () {
        return null;
    },
    set: function (value) {
        console.warn("DEPRECATED: " + this + ".accessibilityAdjustsFontSize = \"" + value + "\" is no longer supported, it is too buggy to maintain. Please use CSS instead");
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYWJlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFvRDtBQUVwRCxNQUFNLENBQUMsY0FBYyxDQUFDLGFBQUssQ0FBQyxTQUFTLEVBQUUsOEJBQThCLEVBQUU7SUFDckUsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEdBQUcsWUFBQyxLQUFLO1FBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBZSxJQUFJLDBDQUFvQyxLQUFLLG1GQUErRSxDQUFDLENBQUM7SUFDNUosQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhYmVsIH0gZnJvbSAnQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2xhYmVsJztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KExhYmVsLnByb3RvdHlwZSwgJ2FjY2Vzc2liaWxpdHlBZGp1c3RzRm9udFNpemUnLCB7XG4gIGdldCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgc2V0KHZhbHVlKSB7XG4gICAgY29uc29sZS53YXJuKGBERVBSRUNBVEVEOiAke3RoaXN9LmFjY2Vzc2liaWxpdHlBZGp1c3RzRm9udFNpemUgPSBcIiR7dmFsdWV9XCIgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgaXQgaXMgdG9vIGJ1Z2d5IHRvIG1haW50YWluLiBQbGVhc2UgdXNlIENTUyBpbnN0ZWFkYCk7XG4gIH0sXG59KTtcbiJdfQ==