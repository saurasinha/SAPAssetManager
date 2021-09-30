import { PressedItem } from '../Common/PressedItem';
export declare class OpenDocument {
    private static _instance;
    private _openDocumentBridge;
    static getInstance(): OpenDocument;
    openWithPath(pressedItem: PressedItem, path: string): Promise<string>;
    clearCache(): void;
}
