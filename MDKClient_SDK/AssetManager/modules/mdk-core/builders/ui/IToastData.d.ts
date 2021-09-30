
import { Frame } from 'tns-core-modules/ui/frame';

export interface IToastData {
  message: string;
  icon: string;
  isIconHidden: boolean;
  maxNumberOfLines: number;
  duration: number;
  animated: boolean;
  background: Frame;
  bottomOffset: Number;
}
