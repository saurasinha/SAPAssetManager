"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var NavigationActionDefinition_1 = require("../definitions/actions/NavigationActionDefinition");
var PageRenderer_1 = require("../pages/PageRenderer");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var NavigationActionBuilder_1 = require("../builders/actions/NavigationActionBuilder");
var TypeConverter_1 = require("../utils/TypeConverter");
var MDKNavigationType_1 = require("../common/MDKNavigationType");
var ExecuteSource_1 = require("../common/ExecuteSource");
var MDKFrame_1 = require("../pages/MDKFrame");
var ModalFrame_1 = require("../pages/ModalFrame");
var NavigationAction = (function (_super) {
    __extends(NavigationAction, _super);
    function NavigationAction(definition) {
        var _this = this;
        if (!(definition instanceof NavigationActionDefinition_1.NavigationActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_NAVIGATIONACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    NavigationAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        var builder = new NavigationActionBuilder_1.NavigationActionBuilder(this.context());
        builder.setClearHistory(definition.isClearHistory)
            .setModalPage(definition.isModalNavigation)
            .setModalPageFullscreen(definition.isFullScreenModal)
            .setPageToOpen(definition.getPageToOpen())
            .setPageMetadata(definition.getPageMetadata())
            .setTransition(definition.getTransition());
        if (definition.getNavigationType()) {
            builder.setNavigationType(definition.getNavigationType());
        }
        else {
            builder.setIsOuterNavigation(definition.isOuterNavigation)
                .setIsInnerNavigation(definition.isInnerNavigation)
                .setIsRootNavigation(definition.isRootNavigation);
        }
        var actionBinding = this.context().clientAPIProps.actionBinding;
        return builder.build().then(function (def) {
            var navType;
            if (def.navigationType) {
                navType = MDKNavigationType_1.parseNavigationType(def.navigationType);
            }
            if (!navType) {
                if (TypeConverter_1.TypeConverter.toBoolean(def.isOuterNavigation)) {
                    navType = MDKNavigationType_1.MDKNavigationType.Outer;
                }
                else if (TypeConverter_1.TypeConverter.toBoolean(def.isInnerNavigation)) {
                    navType = MDKNavigationType_1.MDKNavigationType.Inner;
                }
                else if (TypeConverter_1.TypeConverter.toBoolean(def.isRootNavigation)) {
                    navType = MDKNavigationType_1.MDKNavigationType.Root;
                }
            }
            var sideDrawer = PageRenderer_1.PageRenderer.appLevelSideDrawer;
            var isModal = TypeConverter_1.TypeConverter.toBoolean(def.modalPage);
            if (sideDrawer) {
                if (sideDrawer.blankMainPage) {
                    def.clearHistory = 'true';
                    sideDrawer.blankMainPage = false;
                }
                else if (sideDrawer.blankItemSelected) {
                    var frameId = null;
                    if (sideDrawer.blankItemModalAnchorPage) {
                        frameId = sideDrawer.blankItemModalAnchorPage.modalFrame.id;
                        if (_this.source) {
                            _this.source.frameId = frameId;
                        }
                        else {
                            _this.source = new ExecuteSource_1.ExecuteSource(frameId);
                        }
                    }
                    var parentFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, false, frameId);
                    var isInModal = ModalFrame_1.ModalFrame.isModal(parentFrame);
                    if (!isModal && !isInModal) {
                        var frameId_1 = sideDrawer.navigateToBlankFrame(sideDrawer.blankItemIndexPath[0], sideDrawer.blankItemIndexPath[1]);
                        _this.source = new ExecuteSource_1.ExecuteSource(frameId_1);
                        def.clearHistory = 'true';
                        sideDrawer.blankItemSelected = false;
                        if (actionBinding) {
                            _this.context().clientAPIProps.actionBinding = actionBinding;
                        }
                    }
                }
            }
            var params = {
                isClearHistory: TypeConverter_1.TypeConverter.toBoolean(def.clearHistory),
                isFullScreen: TypeConverter_1.TypeConverter.toBoolean(def.modalPageFullscreen),
                isModalPage: isModal,
                isPopover: false,
                pageReference: def.pageToOpen,
                pageMetadata: def.pageMetadata,
                transition: def.transition,
                navigationType: navType,
                executeSource: _this.source,
            };
            return PageRenderer_1.PageRenderer.showPage(params).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        }, function (error) {
            throw error;
        });
    };
    return NavigationAction;
}(BaseAction_1.BaseAction));
exports.NavigationAction = NavigationAction;
;
