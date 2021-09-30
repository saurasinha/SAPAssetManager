import { ODataServiceActionDefinition } from './ODataServiceActionDefinition';
export declare class ReadODataServiceActionDefinition extends ODataServiceActionDefinition {
    constructor(path: string, data: any);
    getQueryOptions(): string;
}
export default ReadODataServiceActionDefinition;
