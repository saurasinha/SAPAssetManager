Object.defineProperty(exports, "__esModule", { value: true });
function getScaledDimensions(width, height, maxSize) {
    if (height >= width) {
        if (height <= maxSize) {
            return { width: width, height: height };
        }
        return {
            width: Math.round((maxSize * width) / height),
            height: maxSize
        };
    }
    if (width <= maxSize) {
        return { width: width, height: height };
    }
    return {
        width: maxSize,
        height: Math.round((maxSize * height) / width)
    };
}
exports.getScaledDimensions = getScaledDimensions;
//# sourceMappingURL=image-source-common.js.map