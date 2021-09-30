import { ODataServiceActionDefinition } from './ODataServiceActionDefinition';
export declare class CreateODataMediaActionDefinition extends ODataServiceActionDefinition {
    constructor(path: string, data: any);
    getMedia(): string;
}
