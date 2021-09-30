import { DataServiceActionDefinition } from './DataServiceActionDefinition';
export declare class ODataServiceActionDefinition extends DataServiceActionDefinition {
    getEntitySet(): string;
    getProperties(): {
        key: string;
        value: any;
    };
    getForce(): boolean;
    getDefiningRequests(): Array<Object>;
    getHeaders(): Object;
}
