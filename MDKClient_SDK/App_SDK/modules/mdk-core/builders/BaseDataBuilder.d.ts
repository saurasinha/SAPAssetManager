import { IBuilder } from './IBuilder';
import { ValueType } from '../utils/ValueResolver';
import { IContext } from '../context/IContext';
export declare class BaseDataBuilder implements IBuilder {
    protected _context: IContext;
    protected _data: any;
    protected _excludedTypes: [ValueType];
    private _doNotResolveKeys;
    constructor(_context: IContext);
    build(): Promise<any>;
    readonly data: any;
    protected doNotResolveKeys: {
        [key: string]: boolean;
    };
    protected excludedTypes: [ValueType];
    private _buildValue;
}
