import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
export declare class SegmentFactory {
    static build(segment: string, context: IContext): ISegment;
}
