// This is the action interface all actions (custom and snowblind) need to implement
import { IActionResult } from '../context/IClientAPI';
import { BaseActionDefinition } from '../definitions/actions/BaseActionDefinition';
import { IContext } from '../context/IContext';
import { ExecuteSource } from '../common/ExecuteSource';

export interface IAction {
  
  definition: BaseActionDefinition;
  // Return whether or not the action is enabled.
  // @return Boolean
  enabled: Promise<IActionResult>;

  name: string;

  type: string;
  
  // Return whether or not the action is valid.
  // @return Boolean
  valid: Promise<IActionResult>;
  
  defaultIndicatorText: string;

  source: ExecuteSource;
  // Return the action's context
  // @return IContext
  context(): IContext;
  
  // Main execution, returns a Promise indicating whether this succeded/failed
  execute(): Promise<IActionResult>;

  // If the action was invalid, run this code, and abort.
  onInvalid(result: IActionResult): Promise<IActionResult>;

  // Code to run on success. Rest of action chain will continue after this is finished.
  onSuccess(result: IActionResult): Promise<IActionResult>;

  // Code to run on failure. Rest of action chain will be aborted.
  onFailure(result: IActionResult): Promise<IActionResult>;

  // Code to run when the action and all chained success, invalid or failure actions are complete.
  onCompletion(result: IActionResult): Promise<IActionResult>;
}
