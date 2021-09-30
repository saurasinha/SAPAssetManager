import { BaseDataBuilder } from '../BaseDataBuilder';
export declare class GridRowItemBuilder extends BaseDataBuilder {
    setImage(image: string): GridRowItemBuilder;
    setImageSizeAffectsRowHeight(imageSizeAffectsRowHeight: boolean): GridRowItemBuilder;
    setLineBreakMode(lineBreakMode: string): GridRowItemBuilder;
    setNumberOfLines(numberOfLines: number): GridRowItemBuilder;
    setStyle(style: string): GridRowItemBuilder;
    setText(text: string): GridRowItemBuilder;
    setTextAlignment(textAlignment: string): GridRowItemBuilder;
    setBindTo(bindTo: string): GridRowItemBuilder;
}
export declare class GridRowBuilder extends BaseDataBuilder {
    readonly newItem: GridRowItemBuilder;
    setAccessoryType(accessoryType: string): GridRowBuilder;
    setDisableSelectionStyle(disable: boolean): GridRowBuilder;
    setColumnWidth(columnWidth: number[]): GridRowBuilder;
    setColumnWidthPercentage(columnWidthPercentage: number[]): GridRowBuilder;
    setSpacing(spacing: number): GridRowBuilder;
}
