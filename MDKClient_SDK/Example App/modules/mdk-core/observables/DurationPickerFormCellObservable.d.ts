import { BaseFormCellObservable } from './BaseFormCellObservable';
export declare class DurationPickerFormCellObservable extends BaseFormCellObservable {
    private _durationType;
    bindValue(data: any): Promise<any>;
    cellValueChange(newValue: Map<String, any>): Promise<any>;
    getDefUnit(): any;
    getDurationInSeconds(duration: number, unit: string): number;
    getDurationInDefUnits(duration: number, unit: string): number;
    private _convertUnitToSeconds;
}
