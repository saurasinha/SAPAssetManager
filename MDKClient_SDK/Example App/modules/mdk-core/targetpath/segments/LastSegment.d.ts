import { IndexSegment } from './IndexSegment';
import { IIndexable } from '../../context/ContextToIndexable';
export declare class LastSegment extends IndexSegment {
    protected isSpecifierRequired(): boolean;
    protected getIndex(indexable: IIndexable): number;
}
