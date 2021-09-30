import { IContext } from '../../context/IContext';
export declare class SearchBindings {
    static readonly SEARCH_KEY: string;
    static readonly ENABLED_KEY: string;
    static readonly BARCODE_ENABLED_KEY: string;
    static readonly MODE_KEY: string;
}
export declare function asSearch(definition: any, context: IContext): Promise<any>;
