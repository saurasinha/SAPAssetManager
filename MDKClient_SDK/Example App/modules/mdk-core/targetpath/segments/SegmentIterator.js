"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SegmentIterator = (function () {
    function SegmentIterator(targetPath) {
        this.targetPath = targetPath;
    }
    SegmentIterator.prototype.hasNext = function () {
        if (this.targetPath && this.targetPath.length !== 0) {
            return true;
        }
        return false;
    };
    SegmentIterator.prototype.next = function () {
        var done = !this.hasNext();
        var currentSegment = this.splitTargetPath();
        return {
            done: done,
            value: currentSegment,
        };
    };
    SegmentIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    SegmentIterator.prototype.splitTargetPath = function () {
        if (!this.targetPath) {
            return undefined;
        }
        var firstSeparatorPos = this.findFirstSegmentSeparator(this.targetPath);
        var firstSegment = '';
        if (firstSeparatorPos === -1) {
            firstSegment = this.targetPath;
            this.targetPath = '';
        }
        else {
            firstSegment = this.targetPath.slice(0, firstSeparatorPos);
            this.targetPath = this.targetPath.slice(firstSeparatorPos + 1, this.targetPath.length);
        }
        return firstSegment.replace(/\/\//g, '/');
    };
    SegmentIterator.prototype.findFirstSegmentSeparator = function (targetPath) {
        var firstSeparatorPos = targetPath.indexOf(SegmentIterator.SEGMENT_SEPARATOR);
        if ((targetPath.charAt(firstSeparatorPos + 1) !== SegmentIterator.SEGMENT_SEPARATOR) || firstSeparatorPos === -1) {
            return firstSeparatorPos;
        }
        else {
            return firstSeparatorPos + 2 +
                this.findFirstSegmentSeparator(targetPath.slice(firstSeparatorPos + 2, targetPath.length));
        }
    };
    SegmentIterator.SEGMENT_SEPARATOR = '/';
    SegmentIterator.SELECTOR = '#';
    return SegmentIterator;
}());
exports.SegmentIterator = SegmentIterator;
