import { ODataServiceActionDefinition } from './ODataServiceActionDefinition';
export declare class CreateODataEntityActionDefinition extends ODataServiceActionDefinition {
    constructor(path: string, data: any);
    getLinks(): any[];
}
