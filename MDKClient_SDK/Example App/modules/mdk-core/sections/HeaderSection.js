"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var dock_layout_1 = require("tns-core-modules/ui/layouts/dock-layout");
var HeaderSection = (function (_super) {
    __extends(HeaderSection, _super);
    function HeaderSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderSection.prototype._createObservable = function () {
        throw new Error("Method not implemented.");
    };
    HeaderSection.prototype.setHeaderHeight = function (height) {
        var stackLayout;
        if (this.page._toolbar && this.page.content instanceof dock_layout_1.DockLayout) {
            if (this.page.content.getChildAt(1) instanceof stack_layout_1.StackLayout) {
                stackLayout = this.page.content.getChildAt(1).getChildAt(0);
            }
        }
        else if (this.page.content instanceof stack_layout_1.StackLayout) {
            stackLayout = this.page.content.getChildAt(0);
        }
        else if (this.page.content && this.page.content.content instanceof stack_layout_1.StackLayout) {
            stackLayout = this.page.content.content.getChildAt(0);
        }
        if (stackLayout) {
            stackLayout.height = height;
        }
    };
    return HeaderSection;
}(BaseSection_1.BaseSection));
exports.HeaderSection = HeaderSection;
