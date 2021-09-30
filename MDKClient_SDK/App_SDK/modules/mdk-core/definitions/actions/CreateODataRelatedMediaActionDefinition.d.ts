import { ODataServiceActionDefinition } from './ODataServiceActionDefinition';
export declare class CreateODataRelatedMediaActionDefinition extends ODataServiceActionDefinition {
    constructor(path: string, data: any);
    getMedia(): string;
    getParent(): any;
}
