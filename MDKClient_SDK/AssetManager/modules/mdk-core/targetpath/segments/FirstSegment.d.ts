import { IndexSegment } from './IndexSegment';
import { IIndexable } from '../../context/ContextToIndexable';
export declare class FirstSegment extends IndexSegment {
    protected isSpecifierRequired(): boolean;
    protected getIndex(indexable: IIndexable): number;
}
