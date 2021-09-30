"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../utils/helpers");
var slider_common_1 = require("./slider-common");
var NotaUISlider = (function (_super) {
    __extends(NotaUISlider, _super);
    function NotaUISlider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotaUISlider.initWithOwner = function (owner) {
        var slider = NotaUISlider.new();
        slider.owner = owner;
        return slider;
    };
    NotaUISlider.prototype.accessibilityIncrement = function () {
        var owner = this.owner.get();
        if (!owner) {
            this.value += 10;
        }
        else {
            this.value = owner._handlerAccessibilityIncrementEvent();
        }
        this.sendActionsForControlEvents(4096);
    };
    NotaUISlider.prototype.accessibilityDecrement = function () {
        var owner = this.owner.get();
        if (!owner) {
            this.value += 10;
        }
        else {
            this.value = owner._handlerAccessibilityDecrementEvent();
        }
        this.sendActionsForControlEvents(4096);
    };
    return NotaUISlider;
}(UISlider));
helpers_1.setViewFunction(slider_common_1.Slider, 'createNativeView', function sliderCreateNativeView() {
    return NotaUISlider.initWithOwner(new WeakRef(this));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmlvcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNsaWRlci5pb3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBc0Q7QUFDdEQsaURBQXlDO0FBRXpDO0lBQTJCLGdDQUFRO0lBQW5DOztJQStCQSxDQUFDO0lBNUJlLDBCQUFhLEdBQTNCLFVBQTRCLEtBQXNCO1FBQ2hELElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQWtCLENBQUM7UUFDbEQsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFckIsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLDZDQUFzQixHQUE3QjtRQUNFLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDO1NBQzFEO1FBRUQsSUFBSSxDQUFDLDJCQUEyQixNQUE4QixDQUFDO0lBQ2pFLENBQUM7SUFFTSw2Q0FBc0IsR0FBN0I7UUFDRSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztTQUNsQjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsQ0FBQztTQUMxRDtRQUVELElBQUksQ0FBQywyQkFBMkIsTUFBOEIsQ0FBQztJQUNqRSxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBL0JELENBQTJCLFFBQVEsR0ErQmxDO0FBRUQseUJBQWUsQ0FBQyxzQkFBTSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsc0JBQXNCO0lBQ3pFLE9BQU8sWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2V0Vmlld0Z1bmN0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tICcuL3NsaWRlci1jb21tb24nO1xuXG5jbGFzcyBOb3RhVUlTbGlkZXIgZXh0ZW5kcyBVSVNsaWRlciB7XG4gIHB1YmxpYyBvd25lcjogV2Vha1JlZjxTbGlkZXI+O1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5pdFdpdGhPd25lcihvd25lcjogV2Vha1JlZjxTbGlkZXI+KSB7XG4gICAgY29uc3Qgc2xpZGVyID0gTm90YVVJU2xpZGVyLm5ldygpIGFzIE5vdGFVSVNsaWRlcjtcbiAgICBzbGlkZXIub3duZXIgPSBvd25lcjtcblxuICAgIHJldHVybiBzbGlkZXI7XG4gIH1cblxuICBwdWJsaWMgYWNjZXNzaWJpbGl0eUluY3JlbWVudCgpIHtcbiAgICBjb25zdCBvd25lciA9IHRoaXMub3duZXIuZ2V0KCk7XG4gICAgaWYgKCFvd25lcikge1xuICAgICAgdGhpcy52YWx1ZSArPSAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IG93bmVyLl9oYW5kbGVyQWNjZXNzaWJpbGl0eUluY3JlbWVudEV2ZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kQWN0aW9uc0ZvckNvbnRyb2xFdmVudHMoVUlDb250cm9sRXZlbnRzLlZhbHVlQ2hhbmdlZCk7XG4gIH1cblxuICBwdWJsaWMgYWNjZXNzaWJpbGl0eURlY3JlbWVudCgpIHtcbiAgICBjb25zdCBvd25lciA9IHRoaXMub3duZXIuZ2V0KCk7XG4gICAgaWYgKCFvd25lcikge1xuICAgICAgdGhpcy52YWx1ZSArPSAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IG93bmVyLl9oYW5kbGVyQWNjZXNzaWJpbGl0eURlY3JlbWVudEV2ZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kQWN0aW9uc0ZvckNvbnRyb2xFdmVudHMoVUlDb250cm9sRXZlbnRzLlZhbHVlQ2hhbmdlZCk7XG4gIH1cbn1cblxuc2V0Vmlld0Z1bmN0aW9uKFNsaWRlciwgJ2NyZWF0ZU5hdGl2ZVZpZXcnLCBmdW5jdGlvbiBzbGlkZXJDcmVhdGVOYXRpdmVWaWV3KHRoaXM6IFNsaWRlcikge1xuICByZXR1cm4gTm90YVVJU2xpZGVyLmluaXRXaXRoT3duZXIobmV3IFdlYWtSZWYodGhpcykpO1xufSk7XG4iXX0=