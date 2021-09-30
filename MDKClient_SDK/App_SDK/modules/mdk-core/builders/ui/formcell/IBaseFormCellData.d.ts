export interface IValidationProperties {
  SeparatorBackgroundColor: string;
  SeparatorIsHidden: boolean;
  ValidationMessage: string;
  ValidationMessageColor: string;
  ValidationViewBackgroundColor: string;
  ValidationViewIsHidden: boolean;
}

export interface IBaseFormCellData {
  Caption: boolean;
  OnValueChange: number;
  validationProperties: IValidationProperties;
  Value: any;
  _Name: string;
  _Type: string;
}
