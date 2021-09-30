
export interface IGridRowItemData {
  image: string;
  imageSizeAffectsRowHeight: boolean;
  lineBreakMode: string;
  numberOfLines: number;
  style: string;
  text: string;
  textAlignment: string;
}

export interface IGridRowData {
  accessoryType: string;
  items: Array<IGridRowItemData>;
  columnWidth: number[];
  columnWidthPercentage: number[];
  spacing: number;
}
