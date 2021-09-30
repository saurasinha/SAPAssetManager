import { IAction } from '../IAction';
import { IActionResult } from '../../context/IClientAPI';

export interface IActionRunner {
  run(action: IAction): Promise<IActionResult>;
}
