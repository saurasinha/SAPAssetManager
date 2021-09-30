export interface IObservable {
  bindValue(value: any): Promise<any>;
  formatValue(value: any);
  setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
  getValue(): any;
  onDataChanged(action: any, result: any);
}
