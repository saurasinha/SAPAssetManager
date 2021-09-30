import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
export declare class ISegmentFactory {
    static setBuildFunction(func: (segment: string, context: IContext) => ISegment): void;
    static build(segment: string, context: IContext): ISegment;
    private static _build;
}
