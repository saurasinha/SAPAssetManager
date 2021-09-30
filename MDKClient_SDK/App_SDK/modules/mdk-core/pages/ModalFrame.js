"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var frame_1 = require("tns-core-modules/ui/frame");
var MDKPage_1 = require("./MDKPage");
var ClientSettings_1 = require("../storage/ClientSettings");
var ModalFrame = (function (_super) {
    __extends(ModalFrame, _super);
    function ModalFrame(_parentPage, _isFullScreen, _currentModalPage) {
        var _this = _super.call(this) || this;
        _this._parentPage = _parentPage;
        _this._isFullScreen = _isFullScreen;
        _this._currentModalPage = _currentModalPage;
        _this.id = "modal_on_page_" + _this._parentPage.definition.getName();
        if (app.android) {
            _this.on('shownModally', _this._shownModally, _this);
        }
        return _this;
    }
    ModalFrame.isModal = function (frame) {
        return frame instanceof ModalFrame;
    };
    ModalFrame.isPartialModal = function (frame) {
        return ModalFrame.isModal(frame) && !frame.isFullScreen;
    };
    ModalFrame.isTopMostModal = function () {
        return ModalFrame.isModal(frame_1.Frame.topmost());
    };
    ModalFrame.close = function (page, canceled, allowIndicator) {
        if (canceled === void 0) { canceled = true; }
        if (allowIndicator === void 0) { allowIndicator = false; }
        if (ModalFrame.isModal(page.frame)) {
            var modalParent = page.frame.parentPage;
            modalParent.context.clientAPIProps.cancelPendingActions = canceled;
            modalParent.redrawStaleDataListeners(allowIndicator);
            modalParent.updateProgressBar();
            page.frame.closeModal();
            page.frame.parentPage = null;
        }
    };
    ModalFrame.setCurrentModalPage = function (modalPage) {
        var topFrame = frame_1.Frame.topmost();
        if (topFrame instanceof ModalFrame && modalPage && modalPage.id !== "ListPickerFragment") {
            topFrame.currentModalPage = modalPage;
        }
    };
    Object.defineProperty(ModalFrame.prototype, "isFullScreen", {
        get: function () {
            return this._isFullScreen;
        },
        enumerable: true,
        configurable: true
    });
    ModalFrame.prototype.getCurrentModalPage = function () {
        var topMostPage = this.currentPage;
        if (topMostPage && topMostPage.id !== "ListPickerFragment") {
            return topMostPage;
        }
        else {
            return this.currentModalPage;
        }
    };
    ModalFrame.prototype.onUnloaded = function () {
        try {
            _super.prototype.onUnloaded.call(this);
        }
        catch (e) { }
        this.closeModal();
        if (this.parentPage) {
            this.parentPage.dismissModalPage(this._canceled(), undefined, undefined);
            this.parentPage.modalFrame = null;
            this.parentPage.updateProgressBar();
        }
        this._clearPageNavigationFlagsForListPickerFragment();
        MDKPage_1.MDKPage.garbageCollect();
    };
    Object.defineProperty(ModalFrame.prototype, "parentPage", {
        get: function () {
            return this._parentPage;
        },
        set: function (page) {
            this._parentPage = page;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModalFrame.prototype, "currentModalPage", {
        get: function () {
            return this._currentModalPage;
        },
        set: function (modalPage) {
            this._currentModalPage = modalPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModalFrame.prototype, "popOverAnchorItem", {
        get: function () {
            return this._popOverAnchorItem;
        },
        set: function (item) {
            this._popOverAnchorItem = item;
        },
        enumerable: true,
        configurable: true
    });
    ModalFrame.prototype._clearPageNavigationFlagsForListPickerFragment = function () {
        if (this.currentPage.id === "ListPickerFragment") {
            this.currentPage.resetNavigatingFlags();
        }
    };
    ModalFrame.prototype._canceled = function () {
        var canceled = true;
        if (this.parentPage && this.parentPage.context) {
            var context = this.parentPage.context;
            if (context.clientAPIProps) {
                canceled = context.clientAPIProps.cancelPendingActions;
            }
        }
        return canceled;
    };
    ModalFrame.prototype._shownModally = function (args) {
        if (this._dialogFragment) {
            if (!ClientSettings_1.ClientSettings.getScreenSharingWithAndroidVersion()) {
                this._dialogFragment.getDialog().getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
            }
        }
    };
    return ModalFrame;
}(frame_1.Frame));
exports.ModalFrame = ModalFrame;
