"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StackLayoutStrategy_1 = require("./StackLayoutStrategy");
var ControlFactorySync_1 = require("./ControlFactorySync");
var FlexibleColumnLayout_1 = require("./FlexibleColumnLayout");
var PageContentFactory = (function () {
    function PageContentFactory(page, context, containerDefinition, container) {
        this.page = page;
        this.context = context;
        this.containerDefinition = containerDefinition;
        this.container = container;
    }
    PageContentFactory.prototype.createContentAsync = function () {
        var _this = this;
        var contentIsFlexCol = false;
        var fclDefinition = this.containerDefinition.getFlexibleColumnLayout();
        if (fclDefinition) {
            contentIsFlexCol = true;
            var flexColumnLayoutCtl_1 = ControlFactorySync_1.ControlFactorySync.Create(this.page, this.context, this.containerDefinition, fclDefinition);
            return flexColumnLayoutCtl_1.buildLayout().then(function () {
                _this.page.addChildControl(flexColumnLayoutCtl_1);
                _this.page.content = flexColumnLayoutCtl_1.view();
                _this.page.pageTag = FlexibleColumnLayout_1.FlexibleColumnLayout.LAYOUTTYPE_TAG;
                return _this.page;
            });
        }
        var contentHasTabs = false;
        var bottomNavigationDefinition = this.containerDefinition.getBottomNavigation();
        if (bottomNavigationDefinition) {
            contentHasTabs = true;
            var bottomNavContainer_1 = ControlFactorySync_1.ControlFactorySync.Create(this.page, this.context, this.containerDefinition, bottomNavigationDefinition);
            return bottomNavContainer_1.bind().then(function () {
                if (bottomNavContainer_1) {
                    _this.page.addChildControl(bottomNavContainer_1);
                    _this.page.content = bottomNavContainer_1.view();
                    return _this.page;
                }
            });
        }
        if (!contentHasTabs && !contentIsFlexCol) {
            this.stackLayoutFactory = new StackLayoutStrategy_1.StackLayoutStrategy(this.page, this.context, this.containerDefinition, this.container);
            return this.stackLayoutFactory.createLayoutAsync();
        }
    };
    return PageContentFactory;
}());
exports.PageContentFactory = PageContentFactory;
