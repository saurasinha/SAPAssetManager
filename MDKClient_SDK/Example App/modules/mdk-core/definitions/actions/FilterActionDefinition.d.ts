import { NavigationActionDefinition } from './NavigationActionDefinition';
export declare class FilterActionDefinition extends NavigationActionDefinition {
    constructor(path: string, data: any);
    getFilterable(): string;
    isModalPage(): boolean;
}
