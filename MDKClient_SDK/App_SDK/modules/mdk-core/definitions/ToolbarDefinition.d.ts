import { ContainerDefinition } from './ContainerDefinition';
export declare class ToolbarDefinition extends ContainerDefinition {
    constructor(path: any, data: any);
    getCaption(): void;
    getPosition(): any;
    isValidControl(type: any): boolean;
}
