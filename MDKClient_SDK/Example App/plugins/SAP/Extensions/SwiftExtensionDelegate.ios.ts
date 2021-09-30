export class SwiftExtensionDelegate extends NSObject {
    // selector will be exposed so it can be called from native.
    /* tslint:disable */
    public static ObjCExposedMethods = {
      setControlValue: { params: [NSString], returns: interop.types.void },
      executeActionOrRule: { params: [NSString], returns: interop.types.void },
      resolveValue: { params: [NSString], returns: interop.types.void },
    };
    /* tslint:enable */

    public static initWithBridge(bridge, extension): SwiftExtensionDelegate {
      let controlDelegate = <SwiftExtensionDelegate> SwiftExtensionDelegate.new();
      controlDelegate._bridge = bridge;
      controlDelegate._controlExtension = extension;
      return controlDelegate;
    }
    
    private _bridge: any;
    private _controlExtension: any;

    /**
     * Explicitly set reference to control extension
     * @param controlExtension 
     */
    public setControlExtension(controlExtension) {
      this._controlExtension = controlExtension;
    }

    public setControlValue(value) {
      this._controlExtension.setControlValue(value);
    }
  
    public executeActionOrRule(definitionPath) {
      this._controlExtension.executeActionOrRule(definitionPath);
    }
  
    public resolveValue(value) {
      this._controlExtension.resolveValue(value);
    }

}
