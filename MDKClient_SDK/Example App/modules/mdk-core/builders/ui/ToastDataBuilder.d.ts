import { BaseDataBuilder } from '../BaseDataBuilder';
import { Frame } from 'tns-core-modules/ui/frame';
import { IContext } from '../../context/IContext';
export declare class ToastDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setAnimated(animated: boolean): ToastDataBuilder;
    setBackground(background: Frame): ToastDataBuilder;
    setDuration(duration: number): ToastDataBuilder;
    setIcon(icon: string): ToastDataBuilder;
    setIsIconHidden(isIconHidden: boolean): ToastDataBuilder;
    setMaxNumberOfLines(maxNumberOfLines: number): ToastDataBuilder;
    setMessage(message: string): ToastDataBuilder;
    setBottomOffset(offset: number): ToastDataBuilder;
}
