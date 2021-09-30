export declare class SegmentIterator implements IterableIterator<string> {
    private static SEGMENT_SEPARATOR;
    private static SELECTOR;
    private targetPath;
    constructor(targetPath: string);
    hasNext(): boolean;
    next(): IteratorResult<string>;
    [Symbol.iterator](): IterableIterator<string>;
    private splitTargetPath;
    private findFirstSegmentSeparator;
}
