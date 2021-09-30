import { FormCellDataBuilder } from "./FormCellDataBuilder";
import { IContext } from "src/context/IContext";
import { BaseControlDefinition } from "src/definitions/controls/BaseControlDefinition";
export declare class SignatureCaptureDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
}
