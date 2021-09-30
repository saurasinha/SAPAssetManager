import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
export declare class PropertySegment extends ISegment {
    resolve(): IContext;
    private findPropertyByName;
}
