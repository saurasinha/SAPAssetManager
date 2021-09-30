"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientAPI_1 = require("./ClientAPI");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var PageRenderer_1 = require("../pages/PageRenderer");
var ModalFrame_1 = require("../pages/ModalFrame");
var MDKFrame_1 = require("../pages/MDKFrame");
var Context = (function () {
    function Context(binding, element) {
        this.binding = binding;
        this.element = element;
        this.clientAPIProps = {};
    }
    Context.fromPage = function (source) {
        var topmostFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(source, false, source ? source.frameId : null);
        if (PageRenderer_1.PageRenderer.appLevelSideDrawer &&
            PageRenderer_1.PageRenderer.appLevelSideDrawer.blankItemSelected &&
            PageRenderer_1.PageRenderer.appLevelSideDrawer.blankItemModalAnchorPage) {
            topmostFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, false, PageRenderer_1.PageRenderer.appLevelSideDrawer.blankItemModalAnchorPage.modalFrame.id);
        }
        if (topmostFrame instanceof ModalFrame_1.ModalFrame) {
            var currentPage = topmostFrame.getCurrentModalPage();
            if (currentPage && currentPage.context) {
                return currentPage.context;
            }
        }
        if (!topmostFrame || !topmostFrame.currentPage) {
            if (this === undefined) {
                return new Context();
            }
            else if (this._launchContext === undefined) {
                this._launchContext = new Context();
            }
            return this._launchContext;
        }
        var mdkPage = PageRenderer_1.PageRenderer.currentlyRenderedPage || topmostFrame.currentPage;
        var context = mdkPage.context;
        if (mdkPage.modalFrame && mdkPage.modalFrame.currentPage) {
            context = mdkPage.modalFrame.currentPage.context;
        }
        return context;
    };
    Context.prototype.resetClientAPIProps = function () {
        delete this.clientAPIProps.actionBinding;
        delete this.clientAPIProps.pressedItem;
        delete this.clientAPIProps.eventSource;
        delete this.clientAPIProps.contextItem;
    };
    Object.defineProperty(Context.prototype, "clientData", {
        get: function () {
            this._clientData = this._clientData || { actionResults: {} };
            return this._clientData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "clientAPI", {
        get: function () {
            if (this._clientAPI === undefined) {
                this._clientAPI = ClientAPI_1.ClientAPI.Create(this);
            }
            return this._clientAPI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "readLink", {
        get: function () {
            return EvaluateTarget_1.asReadLink(this.binding);
        },
        enumerable: true,
        configurable: true
    });
    Context._launchContext = new Context();
    return Context;
}());
exports.Context = Context;
;
