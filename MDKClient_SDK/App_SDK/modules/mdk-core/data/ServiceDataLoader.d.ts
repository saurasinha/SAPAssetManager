import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ITargetServiceSpecifier } from '../data/ITargetSpecifier';
import { IContext } from '../context/IContext';
interface IDataLoader {
    data: ObservableArray<any>;
    loadMoreItems(context: IContext): Promise<ObservableArray<any>>;
}
export declare class ServiceDataLoader implements IDataLoader {
    private _pageSize;
    private _data;
    private _readPages;
    private _service;
    private _allDataIsRead;
    private _skipToken;
    private _numOfSections;
    private _sectionIndex;
    constructor(service: ITargetServiceSpecifier, _pageSize: number, numOfSections?: number, sectionIndex?: number);
    readonly data: ObservableArray<any>;
    readonly service: ITargetServiceSpecifier;
    isAllDataRead(): boolean;
    loadMoreItems(context: IContext): Promise<any>;
    private _getPageForItem;
    private _readPage;
    private _newServiceWithPagingQueryOptionsForPage;
    private _designQueryForPagingService;
    private _disablePagination;
    private updateData;
}
export {};
