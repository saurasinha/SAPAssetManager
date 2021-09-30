"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var a11y_font_scaling_1 = require("../data/a11y-font-scaling");
var A11YFontScalePipe = (function () {
    function A11YFontScalePipe(fontScaling$) {
        this.fontScaling$ = fontScaling$;
    }
    A11YFontScalePipe.prototype.transform = function (input) {
        return this.fontScaling$.pipe(operators_1.map(function (factor) { return Number(input) * factor; }));
    };
    A11YFontScalePipe = __decorate([
        core_1.Pipe({ name: 'a11yFontScale' }),
        __metadata("design:paramtypes", [a11y_font_scaling_1.A11yFontScalingObservable])
    ], A11YFontScalePipe);
    return A11YFontScalePipe;
}());
exports.A11YFontScalePipe = A11YFontScalePipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYTExeS1mb250LXNjYWxpbmcucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImExMXktZm9udC1zY2FsaW5nLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBb0Q7QUFDcEQsNENBQXFDO0FBQ3JDLCtEQUFzRTtBQUd0RTtJQUNFLDJCQUE2QixZQUF1QztRQUF2QyxpQkFBWSxHQUFaLFlBQVksQ0FBMkI7SUFBRyxDQUFDO0lBRWpFLHFDQUFTLEdBQWhCLFVBQWlCLEtBQXNCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBRyxDQUFDLFVBQUMsTUFBTSxJQUFLLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUxVLGlCQUFpQjtRQUQ3QixXQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUM7eUNBRWEsNkNBQXlCO09BRHpELGlCQUFpQixDQU03QjtJQUFELHdCQUFDO0NBQUEsQUFORCxJQU1DO0FBTlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQTExeUZvbnRTY2FsaW5nT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2RhdGEvYTExeS1mb250LXNjYWxpbmcnO1xuXG5AUGlwZSh7IG5hbWU6ICdhMTF5Rm9udFNjYWxlJyB9KVxuZXhwb3J0IGNsYXNzIEExMVlGb250U2NhbGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm9udFNjYWxpbmckOiBBMTF5Rm9udFNjYWxpbmdPYnNlcnZhYmxlKSB7fVxuXG4gIHB1YmxpYyB0cmFuc2Zvcm0oaW5wdXQ6IG51bWJlciB8IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmZvbnRTY2FsaW5nJC5waXBlKG1hcCgoZmFjdG9yKSA9PiBOdW1iZXIoaW5wdXQpICogZmFjdG9yKSk7XG4gIH1cbn1cbiJdfQ==