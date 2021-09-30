import { Context } from '../context/Context';
export declare class PageContentFactory {
    private page;
    private context;
    private containerDefinition;
    private container;
    private stackLayoutFactory;
    constructor(page: any, context: Context, containerDefinition: any, container: any);
    createContentAsync(): Promise<any>;
}
