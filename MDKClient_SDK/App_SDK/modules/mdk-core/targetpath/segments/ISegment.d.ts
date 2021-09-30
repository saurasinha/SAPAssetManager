import { IContext } from '../../context/IContext';
export declare abstract class ISegment {
    readonly specifier: string;
    readonly context: IContext;
    constructor(specifier: string, context: IContext);
    abstract resolve(): IContext;
    protected isSpecifierRequired(): boolean;
    private throwIfSpecifierRequiredButMissing;
}
