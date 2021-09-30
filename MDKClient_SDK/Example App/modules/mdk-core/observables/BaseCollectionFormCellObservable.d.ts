import { BaseFormCellObservable } from './BaseFormCellObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { IFormCellTargetProxy } from '../context/IClientAPI';
export declare abstract class BaseCollectionFormCellObservable extends BaseFormCellObservable {
    protected _specifierSupportsUniqueIdentifiers: boolean;
    protected readonly specifierSupportsUniqueIdentifiers: boolean;
    protected abstract _DISPLAYED_ITEMS_KEY: any;
    protected _collection: any[];
    protected _specifier: ICollectionSpecifier;
    protected _resolvedItem: any;
    bindValue(data: any): Promise<any>;
    getCollection(): any[];
    getTargetSpecifier(): any;
    buildSpecifier(proxySpecifier: IFormCellTargetProxy): ICollectionSpecifier;
    setTargetSpecifier(proxySpecifier: IFormCellTargetProxy): Promise<any>;
    protected _isValueChanged(oldValue: any): boolean;
    protected _assignItems(): Promise<any>;
    protected _assignSelections(index?: number): Promise<any>;
    protected _bindObjectValuesForSpecifierCollection(value: any): Promise<any>[];
    protected _bindSpecifierCollection(items: ObservableArray<any>): Promise<any>;
    protected _bindObjectValuesForCollection(value: any, firstRow: boolean): any[];
    protected _bindCollection(aObservables: ObservableArray<any>): Promise<any>;
    protected _buildSelectionObject(returnValues: any[], selectedItem: any): Promise<any>;
    protected _readCollection(specifier: ICollectionSpecifier): Promise<ObservableArray<any>>;
    protected _resolveCollection(specifier?: ICollectionSpecifier): Promise<any>;
    protected specifier: ICollectionSpecifier;
    protected _updateTarget(value: any): Promise<any>;
    protected _reset(resetTarget?: boolean): void;
    protected _resolveDisplayValueFormatRule(): Promise<any>;
    protected _setSpecifierSupportsUniqueIdentifiers(specifier?: ICollectionSpecifier): boolean;
    private _buildCollectionObject;
    private parseValue;
}
export declare abstract class CollectionSpecifierFactory {
    static Specifer(definition: any): ICollectionSpecifier;
    static SpecifierBuilder(collectionSpecifier: IFormCellTargetProxy): ICollectionSpecifier;
}
export interface ICollectionSpecifier {
    DisplayValue?: string;
    ReturnValue: string;
    Target: any;
    ObjectCell?: any;
}
export interface ICollectionTuple {
    DisplayValue: string;
    ReturnValue: string;
}
