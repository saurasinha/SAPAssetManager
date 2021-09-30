export declare enum ExecuteSourceType {
    ParentPage = 1,
    ModalPage = 2,
    TabPage = 3,
    TabPageParent = 4,
    TabPageChild = 5
}
export declare class ExecuteSource {
    private _frameId;
    private _sourceType;
    constructor(id: string);
    frameId: string;
    sourceType: ExecuteSourceType;
    static isExecuteSourceParent(source: ExecuteSource): boolean;
    static isExecuteSourceModal(source: ExecuteSource): boolean;
    static isExecuteSourceTab(source: ExecuteSource): boolean;
    static isExecuteSourceTabParent(source: ExecuteSource): boolean;
    static isExecuteSourceTabChild(source: ExecuteSource): boolean;
}
