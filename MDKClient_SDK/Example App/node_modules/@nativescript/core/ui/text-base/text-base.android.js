function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_base_common_1 = require("./text-base-common");
var font_1 = require("../styling/font");
var style_properties_1 = require("../styling/style-properties");
var text_base_common_2 = require("./text-base-common");
var types_1 = require("../../utils/types");
__export(require("./text-base-common"));
var TextTransformation;
function initializeTextTransformation() {
    if (TextTransformation) {
        return;
    }
    var TextTransformationImpl = (function (_super) {
        __extends(TextTransformationImpl, _super);
        function TextTransformationImpl(textBase) {
            var _this = _super.call(this) || this;
            _this.textBase = textBase;
            return global.__native(_this);
        }
        TextTransformationImpl.prototype.getTransformation = function (charSeq, view) {
            var formattedText = this.textBase.formattedText;
            if (formattedText) {
                return createSpannableStringBuilder(formattedText, view.getTextSize());
            }
            else {
                var text = this.textBase.text;
                var stringValue = (text === null || text === undefined) ? "" : text.toString();
                return getTransformedText(stringValue, this.textBase.textTransform);
            }
        };
        TextTransformationImpl.prototype.onFocusChanged = function (view, sourceText, focused, direction, previouslyFocusedRect) {
        };
        TextTransformationImpl = __decorate([
            Interfaces([android.text.method.TransformationMethod])
        ], TextTransformationImpl);
        return TextTransformationImpl;
    }(java.lang.Object));
    TextTransformation = TextTransformationImpl;
}
var ClickableSpan;
function initializeClickableSpan() {
    if (ClickableSpan) {
        return;
    }
    var ClickableSpanImpl = (function (_super) {
        __extends(ClickableSpanImpl, _super);
        function ClickableSpanImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = new WeakRef(owner);
            return global.__native(_this);
        }
        ClickableSpanImpl.prototype.onClick = function (view) {
            var owner = this.owner.get();
            if (owner) {
                owner._emit(text_base_common_2.Span.linkTapEvent);
            }
            view.clearFocus();
            view.invalidate();
        };
        ClickableSpanImpl.prototype.updateDrawState = function (tp) {
        };
        return ClickableSpanImpl;
    }(android.text.style.ClickableSpan));
    ClickableSpan = ClickableSpanImpl;
}
var BaselineAdjustedSpan;
function initializeBaselineAdjustedSpan() {
    if (BaselineAdjustedSpan) {
        return;
    }
    var BaselineAdjustedSpanImpl = (function (_super) {
        __extends(BaselineAdjustedSpanImpl, _super);
        function BaselineAdjustedSpanImpl(fontSize, align) {
            var _this = _super.call(this) || this;
            _this.align = "baseline";
            _this.align = align;
            _this.fontSize = fontSize;
            return _this;
        }
        BaselineAdjustedSpanImpl.prototype.updateDrawState = function (paint) {
            this.updateState(paint);
        };
        BaselineAdjustedSpanImpl.prototype.updateMeasureState = function (paint) {
            this.updateState(paint);
        };
        BaselineAdjustedSpanImpl.prototype.updateState = function (paint) {
            var metrics = paint.getFontMetrics();
            if (!this.align || ["baseline", "stretch"].includes(this.align)) {
                return;
            }
            if (this.align === "top") {
                return paint.baselineShift = -this.fontSize - metrics.bottom - metrics.top;
            }
            if (this.align === "bottom") {
                return paint.baselineShift = metrics.bottom;
            }
            if (this.align === "text-top") {
                return paint.baselineShift = -this.fontSize - metrics.descent - metrics.ascent;
            }
            if (this.align === "text-bottom") {
                return paint.baselineShift = metrics.bottom - metrics.descent;
            }
            if (this.align === "middle") {
                return paint.baselineShift = (metrics.descent - metrics.ascent) / 2 - metrics.descent;
            }
            if (this.align === "super") {
                return paint.baselineShift = -this.fontSize * .4;
            }
            if (this.align === "sub") {
                return paint.baselineShift = (metrics.descent - metrics.ascent) * .4;
            }
        };
        return BaselineAdjustedSpanImpl;
    }(android.text.style.MetricAffectingSpan));
    BaselineAdjustedSpan = BaselineAdjustedSpanImpl;
}
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tappable = false;
        return _this;
    }
    TextBase.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        initializeTextTransformation();
        var nativeView = this.nativeTextViewProtected;
        this._defaultTransformationMethod = nativeView.getTransformationMethod();
        this._defaultMovementMethod = nativeView.getMovementMethod();
        this._minHeight = nativeView.getMinHeight();
        this._maxHeight = nativeView.getMaxHeight();
        this._minLines = nativeView.getMinLines();
        this._maxLines = nativeView.getMaxLines();
    };
    TextBase.prototype.resetNativeView = function () {
        _super.prototype.resetNativeView.call(this);
        var nativeView = this.nativeTextViewProtected;
        nativeView.setSingleLine(this._isSingleLine);
        nativeView.setTransformationMethod(this._defaultTransformationMethod);
        this._defaultTransformationMethod = null;
        if (this._paintFlags !== undefined) {
            nativeView.setPaintFlags(this._paintFlags);
            this._paintFlags = undefined;
        }
        if (this._minLines !== -1) {
            nativeView.setMinLines(this._minLines);
        }
        else {
            nativeView.setMinHeight(this._minHeight);
        }
        this._minHeight = this._minLines = undefined;
        if (this._maxLines !== -1) {
            nativeView.setMaxLines(this._maxLines);
        }
        else {
            nativeView.setMaxHeight(this._maxHeight);
        }
        this._maxHeight = this._maxLines = undefined;
    };
    TextBase.prototype[text_base_common_2.textProperty.getDefault] = function () {
        return text_base_common_2.resetSymbol;
    };
    TextBase.prototype[text_base_common_2.textProperty.setNative] = function (value) {
        var reset = value === text_base_common_2.resetSymbol;
        if (!reset && this.formattedText) {
            return;
        }
        this._setTappableState(false);
        this._setNativeText(reset);
    };
    TextBase.prototype[text_base_common_2.formattedTextProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        if (!value) {
            if (nativeView instanceof android.widget.Button &&
                nativeView.getTransformationMethod() instanceof TextTransformation) {
                nativeView.setTransformationMethod(this._defaultTransformationMethod);
            }
        }
        if (this.secure) {
            return;
        }
        var spannableStringBuilder = createSpannableStringBuilder(value, this.style.fontSize);
        nativeView.setText(spannableStringBuilder);
        this._setTappableState(isStringTappable(value));
        text_base_common_2.textProperty.nativeValueChange(this, (value === null || value === undefined) ? "" : value.toString());
        if (spannableStringBuilder && nativeView instanceof android.widget.Button &&
            !(nativeView.getTransformationMethod() instanceof TextTransformation)) {
            nativeView.setTransformationMethod(new TextTransformation(this));
        }
    };
    TextBase.prototype[text_base_common_2.textTransformProperty.setNative] = function (value) {
        if (value === "initial") {
            this.nativeTextViewProtected.setTransformationMethod(this._defaultTransformationMethod);
            return;
        }
        if (this.secure) {
            return;
        }
        this.nativeTextViewProtected.setTransformationMethod(new TextTransformation(this));
    };
    TextBase.prototype[text_base_common_2.textAlignmentProperty.getDefault] = function () {
        return "initial";
    };
    TextBase.prototype[text_base_common_2.textAlignmentProperty.setNative] = function (value) {
        var verticalGravity = this.nativeTextViewProtected.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
        switch (value) {
            case "initial":
            case "left":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.START | verticalGravity);
                break;
            case "center":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                break;
            case "right":
                this.nativeTextViewProtected.setGravity(android.view.Gravity.END | verticalGravity);
                break;
        }
    };
    TextBase.prototype[text_base_common_2.whiteSpaceProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        switch (value) {
            case "initial":
            case "normal":
                nativeView.setSingleLine(false);
                nativeView.setEllipsize(null);
                break;
            case "nowrap":
                nativeView.setSingleLine(true);
                nativeView.setEllipsize(android.text.TextUtils.TruncateAt.END);
                break;
        }
    };
    TextBase.prototype[text_base_common_2.colorProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getTextColors();
    };
    TextBase.prototype[text_base_common_2.colorProperty.setNative] = function (value) {
        if (!this.formattedText || !(value instanceof text_base_common_2.Color)) {
            if (value instanceof text_base_common_2.Color) {
                this.nativeTextViewProtected.setTextColor(value.android);
            }
            else {
                this.nativeTextViewProtected.setTextColor(value);
            }
        }
    };
    TextBase.prototype[text_base_common_2.fontSizeProperty.getDefault] = function () {
        return { nativeSize: this.nativeTextViewProtected.getTextSize() };
    };
    TextBase.prototype[text_base_common_2.fontSizeProperty.setNative] = function (value) {
        if (!this.formattedText || (typeof value !== "number")) {
            if (typeof value === "number") {
                this.nativeTextViewProtected.setTextSize(value);
            }
            else {
                this.nativeTextViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        }
    };
    TextBase.prototype[text_base_common_2.lineHeightProperty.getDefault] = function () {
        return this.nativeView.getLineSpacingExtra() / text_base_common_2.layout.getDisplayDensity();
    };
    TextBase.prototype[text_base_common_2.lineHeightProperty.setNative] = function (value) {
        this.nativeView.setLineSpacing(value * text_base_common_2.layout.getDisplayDensity(), 1);
    };
    TextBase.prototype[text_base_common_2.fontInternalProperty.getDefault] = function () {
        return this.nativeTextViewProtected.getTypeface();
    };
    TextBase.prototype[text_base_common_2.fontInternalProperty.setNative] = function (value) {
        if (!this.formattedText || !(value instanceof font_1.Font)) {
            this.nativeTextViewProtected.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
        }
    };
    TextBase.prototype[text_base_common_2.textDecorationProperty.getDefault] = function (value) {
        return this._paintFlags = this.nativeTextViewProtected.getPaintFlags();
    };
    TextBase.prototype[text_base_common_2.textDecorationProperty.setNative] = function (value) {
        switch (value) {
            case "none":
                this.nativeTextViewProtected.setPaintFlags(0);
                break;
            case "underline":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.UNDERLINE_TEXT_FLAG);
                break;
            case "line-through":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
                break;
            case "underline line-through":
                this.nativeTextViewProtected.setPaintFlags(android.graphics.Paint.UNDERLINE_TEXT_FLAG | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
                break;
            default:
                this.nativeTextViewProtected.setPaintFlags(value);
                break;
        }
    };
    TextBase.prototype[text_base_common_2.letterSpacingProperty.getDefault] = function () {
        return org.nativescript.widgets.ViewHelper.getLetterspacing(this.nativeTextViewProtected);
    };
    TextBase.prototype[text_base_common_2.letterSpacingProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setLetterspacing(this.nativeTextViewProtected, value);
    };
    TextBase.prototype[text_base_common_2.paddingTopProperty.getDefault] = function () {
        return { value: this._defaultPaddingTop, unit: "px" };
    };
    TextBase.prototype[text_base_common_2.paddingTopProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeTextViewProtected, text_base_common_2.Length.toDevicePixels(value, 0) + text_base_common_2.Length.toDevicePixels(this.style.borderTopWidth, 0));
    };
    TextBase.prototype[text_base_common_2.paddingRightProperty.getDefault] = function () {
        return { value: this._defaultPaddingRight, unit: "px" };
    };
    TextBase.prototype[text_base_common_2.paddingRightProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeTextViewProtected, text_base_common_2.Length.toDevicePixels(value, 0) + text_base_common_2.Length.toDevicePixels(this.style.borderRightWidth, 0));
    };
    TextBase.prototype[text_base_common_2.paddingBottomProperty.getDefault] = function () {
        return { value: this._defaultPaddingBottom, unit: "px" };
    };
    TextBase.prototype[text_base_common_2.paddingBottomProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeTextViewProtected, text_base_common_2.Length.toDevicePixels(value, 0) + text_base_common_2.Length.toDevicePixels(this.style.borderBottomWidth, 0));
    };
    TextBase.prototype[text_base_common_2.paddingLeftProperty.getDefault] = function () {
        return { value: this._defaultPaddingLeft, unit: "px" };
    };
    TextBase.prototype[text_base_common_2.paddingLeftProperty.setNative] = function (value) {
        org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeTextViewProtected, text_base_common_2.Length.toDevicePixels(value, 0) + text_base_common_2.Length.toDevicePixels(this.style.borderLeftWidth, 0));
    };
    TextBase.prototype._setNativeText = function (reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            this.nativeTextViewProtected.setText(null);
            return;
        }
        var transformedText;
        if (this.formattedText) {
            transformedText = createSpannableStringBuilder(this.formattedText, this.style.fontSize);
        }
        else {
            var text = this.text;
            var stringValue = (text === null || text === undefined) ? "" : text.toString();
            transformedText = getTransformedText(stringValue, this.textTransform);
        }
        this.nativeTextViewProtected.setText(transformedText);
    };
    TextBase.prototype._setTappableState = function (tappable) {
        if (this._tappable !== tappable) {
            this._tappable = tappable;
            if (this._tappable) {
                this.nativeViewProtected.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
                this.nativeViewProtected.setHighlightColor(null);
            }
            else {
                this.nativeViewProtected.setMovementMethod(this._defaultMovementMethod);
            }
        }
    };
    return TextBase;
}(text_base_common_2.TextBaseCommon));
exports.TextBase = TextBase;
function getCapitalizedString(str) {
    var words = str.split(" ");
    var newWords = [];
    for (var i = 0, length_1 = words.length; i < length_1; i++) {
        var word = words[i].toLowerCase();
        newWords.push(word.substr(0, 1).toUpperCase() + word.substring(1));
    }
    return newWords.join(" ");
}
function getTransformedText(text, textTransform) {
    if (!text || !types_1.isString(text)) {
        return "";
    }
    switch (textTransform) {
        case "uppercase":
            return text.toUpperCase();
        case "lowercase":
            return text.toLowerCase();
        case "capitalize":
            return getCapitalizedString(text);
        case "none":
        default:
            return text;
    }
}
exports.getTransformedText = getTransformedText;
function isStringTappable(formattedString) {
    if (!formattedString) {
        return false;
    }
    for (var i = 0, length_2 = formattedString.spans.length; i < length_2; i++) {
        var span = formattedString.spans.getItem(i);
        if (span.tappable) {
            return true;
        }
    }
    return false;
}
function createSpannableStringBuilder(formattedString, defaultFontSize) {
    if (!formattedString || !formattedString.parent) {
        return null;
    }
    var ssb = new android.text.SpannableStringBuilder();
    for (var i = 0, spanStart = 0, spanLength = 0, length_3 = formattedString.spans.length; i < length_3; i++) {
        var span = formattedString.spans.getItem(i);
        var text = span.text;
        var textTransform = formattedString.parent.textTransform;
        var spanText = (text === null || text === undefined) ? "" : text.toString();
        if (textTransform && textTransform !== "none") {
            spanText = getTransformedText(spanText, textTransform);
        }
        spanLength = spanText.length;
        if (spanLength > 0) {
            ssb.insert(spanStart, spanText);
            setSpanModifiers(ssb, span, spanStart, spanStart + spanLength, defaultFontSize);
            spanStart += spanLength;
        }
    }
    return ssb;
}
function setSpanModifiers(ssb, span, start, end, defaultFontSize) {
    var spanStyle = span.style;
    var bold = text_base_common_2.isBold(spanStyle.fontWeight);
    var italic = spanStyle.fontStyle === "italic";
    var align = spanStyle.verticalAlignment;
    if (bold && italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (bold) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var fontFamily = span.fontFamily;
    if (fontFamily) {
        var font = new font_1.Font(fontFamily, 0, (italic) ? "italic" : "normal", (bold) ? "bold" : "normal");
        var typeface = font.getAndroidTypeface() || android.graphics.Typeface.create(fontFamily, 0);
        var typefaceSpan = new org.nativescript.widgets.CustomTypefaceSpan(fontFamily, typeface);
        ssb.setSpan(typefaceSpan, start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var realFontSize = span.fontSize;
    if (realFontSize) {
        ssb.setSpan(new android.text.style.AbsoluteSizeSpan(realFontSize * text_base_common_2.layout.getDisplayDensity()), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var color = span.color;
    if (color) {
        ssb.setSpan(new android.text.style.ForegroundColorSpan(color.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var backgroundColor = text_base_common_1.getClosestPropertyValue(style_properties_1.backgroundColorProperty, span);
    if (backgroundColor) {
        ssb.setSpan(new android.text.style.BackgroundColorSpan(backgroundColor.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var textDecoration = text_base_common_1.getClosestPropertyValue(text_base_common_2.textDecorationProperty, span);
    if (textDecoration) {
        var underline_1 = textDecoration.indexOf("underline") !== -1;
        if (underline_1) {
            ssb.setSpan(new android.text.style.UnderlineSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
        var strikethrough = textDecoration.indexOf("line-through") !== -1;
        if (strikethrough) {
            ssb.setSpan(new android.text.style.StrikethroughSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }
    if (align) {
        initializeBaselineAdjustedSpan();
        ssb.setSpan(new BaselineAdjustedSpan(defaultFontSize * text_base_common_2.layout.getDisplayDensity(), align), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var tappable = span.tappable;
    if (tappable) {
        initializeClickableSpan();
        ssb.setSpan(new ClickableSpan(span), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
}
//# sourceMappingURL=text-base.android.js.map