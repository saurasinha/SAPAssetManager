import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
import { IIndexable } from '../../context/ContextToIndexable';
export declare class IndexSegment extends ISegment {
    resolve(): IContext;
    protected getIndex(indexable: IIndexable): number;
}
