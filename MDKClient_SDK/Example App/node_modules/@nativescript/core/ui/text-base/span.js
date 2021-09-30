Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tappable = false;
        return _this;
    }
    Object.defineProperty(Span.prototype, "fontFamily", {
        get: function () {
            return this.style.fontFamily;
        },
        set: function (value) {
            this.style.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "fontSize", {
        get: function () {
            return this.style.fontSize;
        },
        set: function (value) {
            this.style.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "fontStyle", {
        get: function () {
            return this.style.fontStyle;
        },
        set: function (value) {
            this.style.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "fontWeight", {
        get: function () {
            return this.style.fontWeight;
        },
        set: function (value) {
            this.style.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "textDecoration", {
        get: function () {
            return this.style.textDecoration;
        },
        set: function (value) {
            this.style.textDecoration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "color", {
        get: function () {
            return this.style.color;
        },
        set: function (value) {
            this.style.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "backgroundColor", {
        get: function () {
            return this.style.backgroundColor;
        },
        set: function (value) {
            this.style.backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            if (this._text !== value) {
                this._text = ("" + value).replace("\\n", "\n").replace("\\t", "\t");
                this.notifyPropertyChange("text", this._text);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "tappable", {
        get: function () {
            return this._tappable;
        },
        enumerable: true,
        configurable: true
    });
    Span.prototype.addEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        this._setTappable(this.hasListeners(Span.linkTapEvent));
    };
    Span.prototype.removeEventListener = function (arg, callback, thisArg) {
        _super.prototype.removeEventListener.call(this, arg, callback, thisArg);
        this._setTappable(this.hasListeners(Span.linkTapEvent));
    };
    Span.prototype._setTextInternal = function (value) {
        this._text = value;
    };
    Span.prototype._setTappable = function (value) {
        if (this._tappable !== value) {
            this._tappable = value;
            this.notifyPropertyChange("tappable", value);
        }
    };
    Span.linkTapEvent = "linkTap";
    return Span;
}(view_1.ViewBase));
exports.Span = Span;
//# sourceMappingURL=span.js.map