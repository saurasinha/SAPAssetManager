import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
export declare class ControlSegment extends ISegment {
    resolve(): IContext;
    private findControlByName;
    private findControlInChildControls;
}
