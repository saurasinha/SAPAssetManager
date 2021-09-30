function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_base_common_1 = require("./text-base-common");
var font_1 = require("../styling/font");
var text_base_common_2 = require("./text-base-common");
var types_1 = require("../../utils/types");
var utils_1 = require("../../utils/utils");
__export(require("./text-base-common"));
var majorVersion = utils_1.ios.MajorVersion;
var UILabelClickHandlerImpl = (function (_super) {
    __extends(UILabelClickHandlerImpl, _super);
    function UILabelClickHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UILabelClickHandlerImpl.initWithOwner = function (owner) {
        var handler = UILabelClickHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    UILabelClickHandlerImpl.prototype.linkTap = function (tapGesture) {
        var owner = this._owner.get();
        if (owner) {
            var label = owner.nativeTextViewProtected;
            var layoutManager = NSLayoutManager.alloc().init();
            var textContainer = NSTextContainer.alloc().initWithSize(CGSizeZero);
            var textStorage = NSTextStorage.alloc().initWithAttributedString(owner.nativeTextViewProtected["attributedText"]);
            layoutManager.addTextContainer(textContainer);
            textStorage.addLayoutManager(layoutManager);
            textContainer.lineFragmentPadding = 0;
            textContainer.lineBreakMode = label.lineBreakMode;
            textContainer.maximumNumberOfLines = label.numberOfLines;
            var labelSize = label.bounds.size;
            textContainer.size = labelSize;
            var locationOfTouchInLabel = tapGesture.locationInView(label);
            var textBoundingBox = layoutManager.usedRectForTextContainer(textContainer);
            var textContainerOffset = CGPointMake((labelSize.width - textBoundingBox.size.width) * 0.5 - textBoundingBox.origin.x, (labelSize.height - textBoundingBox.size.height) * 0.5 - textBoundingBox.origin.y);
            var locationOfTouchInTextContainer = CGPointMake(locationOfTouchInLabel.x - textContainerOffset.x, locationOfTouchInLabel.y - textContainerOffset.y);
            var indexOfCharacter = layoutManager.characterIndexForPointInTextContainerFractionOfDistanceBetweenInsertionPoints(locationOfTouchInTextContainer, textContainer, null);
            var span = null;
            for (var i = 0; i < owner._spanRanges.length; i++) {
                var range = owner._spanRanges[i];
                if ((range.location <= indexOfCharacter) && (range.location + range.length) > indexOfCharacter) {
                    if (owner.formattedText && owner.formattedText.spans.length > i) {
                        span = owner.formattedText.spans.getItem(i);
                    }
                    break;
                }
            }
            if (span && span.tappable) {
                span._emit(text_base_common_2.Span.linkTapEvent);
            }
        }
    };
    UILabelClickHandlerImpl.ObjCExposedMethods = {
        "linkTap": { returns: interop.types.void, params: [interop.types.id] }
    };
    return UILabelClickHandlerImpl;
}(NSObject));
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tappable = false;
        return _this;
    }
    TextBase.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._setTappableState(false);
    };
    TextBase.prototype._setTappableState = function (tappable) {
        if (this._tappable !== tappable) {
            this._tappable = tappable;
            if (this._tappable) {
                var tapHandler = UILabelClickHandlerImpl.initWithOwner(new WeakRef(this));
                this.handler = tapHandler;
                this._tapGestureRecognizer = UITapGestureRecognizer.alloc().initWithTargetAction(tapHandler, "linkTap");
                this.nativeViewProtected.userInteractionEnabled = true;
                this.nativeViewProtected.addGestureRecognizer(this._tapGestureRecognizer);
            }
            else {
                this.nativeViewProtected.userInteractionEnabled = false;
                this.nativeViewProtected.removeGestureRecognizer(this._tapGestureRecognizer);
            }
        }
    };
    TextBase.prototype[text_base_common_2.textProperty.getDefault] = function () {
        return text_base_common_2.resetSymbol;
    };
    TextBase.prototype[text_base_common_2.textProperty.setNative] = function (value) {
        var reset = value === text_base_common_2.resetSymbol;
        if (!reset && this.formattedText) {
            return;
        }
        this._setNativeText(reset);
        this._requestLayoutOnTextChanged();
    };
    TextBase.prototype[text_base_common_2.formattedTextProperty.setNative] = function (value) {
        this._setNativeText();
        this._setTappableState(isStringTappable(value));
        text_base_common_2.textProperty.nativeValueChange(this, !value ? "" : value.toString());
        this._requestLayoutOnTextChanged();
    };
    TextBase.prototype[text_base_common_2.colorProperty.getDefault] = function () {
        var nativeView = this.nativeTextViewProtected;
        if (nativeView instanceof UIButton) {
            return nativeView.titleColorForState(0);
        }
        else {
            return nativeView.textColor;
        }
    };
    TextBase.prototype[text_base_common_2.colorProperty.setNative] = function (value) {
        var color = value instanceof text_base_common_2.Color ? value.ios : value;
        this._setColor(color);
    };
    TextBase.prototype[text_base_common_2.fontInternalProperty.getDefault] = function () {
        var nativeView = this.nativeTextViewProtected;
        nativeView = nativeView instanceof UIButton ? nativeView.titleLabel : nativeView;
        return nativeView.font;
    };
    TextBase.prototype[text_base_common_2.fontInternalProperty.setNative] = function (value) {
        if (!(value instanceof font_1.Font) || !this.formattedText) {
            var nativeView = this.nativeTextViewProtected;
            nativeView = nativeView instanceof UIButton ? nativeView.titleLabel : nativeView;
            var font = value instanceof font_1.Font ? value.getUIFont(nativeView.font) : value;
            nativeView.font = font;
        }
    };
    TextBase.prototype[text_base_common_2.textAlignmentProperty.setNative] = function (value) {
        var nativeView = this.nativeTextViewProtected;
        switch (value) {
            case "initial":
            case "left":
                nativeView.textAlignment = 0;
                break;
            case "center":
                nativeView.textAlignment = 1;
                break;
            case "right":
                nativeView.textAlignment = 2;
                break;
        }
    };
    TextBase.prototype[text_base_common_2.textDecorationProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_2.textTransformProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_2.letterSpacingProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype[text_base_common_2.lineHeightProperty.setNative] = function (value) {
        this._setNativeText();
    };
    TextBase.prototype._setNativeText = function (reset) {
        if (reset === void 0) { reset = false; }
        if (reset) {
            var nativeView = this.nativeTextViewProtected;
            if (nativeView instanceof UIButton) {
                nativeView.setAttributedTitleForState(null, 0);
                nativeView.setTitleForState(null, 0);
            }
            else {
                nativeView.attributedText = null;
                nativeView.text = null;
            }
            return;
        }
        if (this.formattedText) {
            this.setFormattedTextDecorationAndTransform();
        }
        else {
            this.setTextDecorationAndTransform();
        }
    };
    TextBase.prototype._setColor = function (color) {
        if (this.nativeTextViewProtected instanceof UIButton) {
            this.nativeTextViewProtected.setTitleColorForState(color, 0);
            this.nativeTextViewProtected.titleLabel.textColor = color;
        }
        else {
            this.nativeTextViewProtected.textColor = color;
        }
    };
    TextBase.prototype.setFormattedTextDecorationAndTransform = function () {
        var attrText = this.createNSMutableAttributedString(this.formattedText);
        if (this.letterSpacing !== 0) {
            attrText.addAttributeValueRange(NSKernAttributeName, this.letterSpacing * this.nativeTextViewProtected.font.pointSize, { location: 0, length: attrText.length });
        }
        if (this.style.lineHeight) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.minimumLineHeight = this.lineHeight;
            if (this.nativeTextViewProtected instanceof UIButton) {
                paragraphStyle.alignment = this.nativeTextViewProtected.titleLabel.textAlignment;
            }
            else {
                paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            }
            if (this.nativeTextViewProtected instanceof UILabel) {
                paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
            }
            attrText.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, { location: 0, length: attrText.length });
        }
        else if (this.nativeTextViewProtected instanceof UITextView) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            attrText.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, { location: 0, length: attrText.length });
        }
        if (this.nativeTextViewProtected instanceof UIButton) {
            this.nativeTextViewProtected.setAttributedTitleForState(attrText, 0);
        }
        else {
            if (majorVersion >= 13 && UIColor.labelColor) {
                this.nativeTextViewProtected.textColor = UIColor.labelColor;
            }
            this.nativeTextViewProtected.attributedText = attrText;
        }
    };
    TextBase.prototype.setTextDecorationAndTransform = function () {
        var style = this.style;
        var dict = new Map();
        switch (style.textDecoration) {
            case "none":
                break;
            case "underline":
                dict.set(NSUnderlineStyleAttributeName, 1);
                break;
            case "line-through":
                dict.set(NSStrikethroughStyleAttributeName, 1);
                break;
            case "underline line-through":
                dict.set(NSUnderlineStyleAttributeName, 1);
                dict.set(NSStrikethroughStyleAttributeName, 1);
                break;
            default:
                throw new Error("Invalid text decoration value: " + style.textDecoration + ". Valid values are: 'none', 'underline', 'line-through', 'underline line-through'.");
        }
        if (style.letterSpacing !== 0 && this.nativeTextViewProtected.font) {
            var kern = style.letterSpacing * this.nativeTextViewProtected.font.pointSize;
            dict.set(NSKernAttributeName, kern);
            if (this.nativeTextViewProtected instanceof UITextField) {
                this.nativeTextViewProtected.defaultTextAttributes.setValueForKey(kern, NSKernAttributeName);
            }
        }
        var isTextView = this.nativeTextViewProtected instanceof UITextView;
        if (style.lineHeight) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.lineSpacing = style.lineHeight;
            if (this.nativeTextViewProtected instanceof UIButton) {
                paragraphStyle.alignment = this.nativeTextViewProtected.titleLabel.textAlignment;
            }
            else {
                paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            }
            if (this.nativeTextViewProtected instanceof UILabel) {
                paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
            }
            dict.set(NSParagraphStyleAttributeName, paragraphStyle);
        }
        else if (isTextView) {
            var paragraphStyle = NSMutableParagraphStyle.alloc().init();
            paragraphStyle.alignment = this.nativeTextViewProtected.textAlignment;
            dict.set(NSParagraphStyleAttributeName, paragraphStyle);
        }
        var source = getTransformedText(this.text ? this.text.toString() : "", this.textTransform);
        if (dict.size > 0 || isTextView) {
            if (isTextView && this.nativeTextViewProtected.font) {
                dict.set(NSFontAttributeName, this.nativeTextViewProtected.font);
            }
            var result = NSMutableAttributedString.alloc().initWithString(source);
            result.setAttributesRange(dict, { location: 0, length: source.length });
            if (this.nativeTextViewProtected instanceof UIButton) {
                this.nativeTextViewProtected.setAttributedTitleForState(result, 0);
            }
            else {
                this.nativeTextViewProtected.attributedText = result;
            }
        }
        else {
            if (this.nativeTextViewProtected instanceof UIButton) {
                this.nativeTextViewProtected.setAttributedTitleForState(null, 0);
                this.nativeTextViewProtected.setTitleForState(source, 0);
            }
            else {
                this.nativeTextViewProtected.attributedText = undefined;
                this.nativeTextViewProtected.text = source;
            }
        }
        if (!style.color && majorVersion >= 13 && UIColor.labelColor) {
            this._setColor(UIColor.labelColor);
        }
    };
    TextBase.prototype.createNSMutableAttributedString = function (formattedString) {
        var mas = NSMutableAttributedString.alloc().init();
        this._spanRanges = [];
        if (formattedString && formattedString.parent) {
            for (var i = 0, spanStart = 0, length_1 = formattedString.spans.length; i < length_1; i++) {
                var span = formattedString.spans.getItem(i);
                var text = span.text;
                var textTransform = formattedString.parent.textTransform;
                var spanText = (text === null || text === undefined) ? "" : text.toString();
                if (textTransform !== "none" && textTransform !== "initial") {
                    spanText = getTransformedText(spanText, textTransform);
                }
                var nsAttributedString = this.createMutableStringForSpan(span, spanText);
                mas.insertAttributedStringAtIndex(nsAttributedString, spanStart);
                this._spanRanges.push({ location: spanStart, length: spanText.length });
                spanStart += spanText.length;
            }
        }
        return mas;
    };
    TextBase.prototype.getBaselineOffset = function (font, align) {
        if (!align || ["stretch", "baseline"].includes(align)) {
            return 0;
        }
        if (align === "top") {
            return -this.fontSize - font.descender - font.ascender - font.leading / 2;
        }
        if (align === "bottom") {
            return font.descender + font.leading / 2;
        }
        if (align === "text-top") {
            return -this.fontSize - font.descender - font.ascender;
        }
        if (align === "text-bottom") {
            return font.descender;
        }
        if (align === "middle") {
            return (font.descender - font.ascender) / 2 - font.descender;
        }
        if (align === "super") {
            return -this.fontSize * .4;
        }
        if (align === "sub") {
            return (font.descender - font.ascender) * .4;
        }
    };
    TextBase.prototype.createMutableStringForSpan = function (span, text) {
        var viewFont = this.nativeTextViewProtected.font;
        var attrDict = {};
        var style = span.style;
        var align = style.verticalAlignment;
        var font = new font_1.Font(style.fontFamily, style.fontSize, style.fontStyle, style.fontWeight);
        var iosFont = font.getUIFont(viewFont);
        attrDict[NSFontAttributeName] = iosFont;
        if (span.color) {
            attrDict[NSForegroundColorAttributeName] = span.color.ios;
        }
        var backgroundColor = (style.backgroundColor
            || span.parent.backgroundColor
            || span.parent.parent.backgroundColor);
        if (backgroundColor) {
            attrDict[NSBackgroundColorAttributeName] = backgroundColor.ios;
        }
        var textDecoration = text_base_common_1.getClosestPropertyValue(text_base_common_2.textDecorationProperty, span);
        if (textDecoration) {
            var underline_1 = textDecoration.indexOf("underline") !== -1;
            if (underline_1) {
                attrDict[NSUnderlineStyleAttributeName] = underline_1;
            }
            var strikethrough = textDecoration.indexOf("line-through") !== -1;
            if (strikethrough) {
                attrDict[NSStrikethroughStyleAttributeName] = strikethrough;
            }
        }
        if (align) {
            attrDict[NSBaselineOffsetAttributeName] = this.getBaselineOffset(iosFont, align);
        }
        return NSMutableAttributedString.alloc().initWithStringAttributes(text, attrDict);
    };
    return TextBase;
}(text_base_common_2.TextBaseCommon));
exports.TextBase = TextBase;
function getTransformedText(text, textTransform) {
    if (!text || !types_1.isString(text)) {
        return "";
    }
    switch (textTransform) {
        case "uppercase":
            return NSStringFromNSAttributedString(text).uppercaseString;
        case "lowercase":
            return NSStringFromNSAttributedString(text).lowercaseString;
        case "capitalize":
            return NSStringFromNSAttributedString(text).capitalizedString;
        default:
            return text;
    }
}
exports.getTransformedText = getTransformedText;
function NSStringFromNSAttributedString(source) {
    return NSString.stringWithString(source instanceof NSAttributedString && source.string || source);
}
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
//# sourceMappingURL=text-base.ios.js.map