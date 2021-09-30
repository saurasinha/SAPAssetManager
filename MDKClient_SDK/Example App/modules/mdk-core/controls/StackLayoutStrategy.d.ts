import { Context } from '../context/Context';
export declare class StackLayoutStrategy {
    private page;
    private context;
    private containerDefinition;
    private container;
    constructor(page: any, context: Context, containerDefinition: any, container: any);
    createLayout(): Promise<any>;
    private wrapControlWithPullToRefreshControl;
    createLayoutAsync(): Promise<any>;
    private getControlView;
}
