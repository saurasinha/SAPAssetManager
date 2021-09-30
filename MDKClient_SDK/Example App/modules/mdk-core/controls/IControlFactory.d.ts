import { ContainerDefinition } from '../definitions/ContainerDefinition';
export declare class IControlFactory {
    static setCreateFunction(func: (page: any, context: any, container: ContainerDefinition, definition: any) => any): void;
    static Create(page: any, context: any, container: ContainerDefinition, definition: any): any;
    private static _Create;
}
