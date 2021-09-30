export class SwiftExtensionDelegate extends NSObject {
    // selector will be exposed so it can be called from native.
    /* tslint:disable */
    public static ObjCExposedMethods = {
      setControlValue: { value: [NSString], returns: interop.types.void },
      executeActionOrRule: { definitionPath: [NSString], returns: interop.types.void },
      resolveValue: { value: [NSString], returns: interop.types.void },
    };

    /* tslint:enable */
    public static initWithBridge(bridge, extension): SwiftExtensionDelegate {
      return undefined;
    }
    private _bridge: any;
    private _controlExtension: any;

    /**
     * Explicitly set reference to control extension
     * @param controlExtension 
     */
    public setControlExtension(controlExtension) {
      // no-op
    }

    public setControlValue(value) {
      // no-op
    }
  
    public executeActionOrRule(definitionPath) {
      // no-op
    }
  
    public resolveValue(value) {
      // no-op
    }

}
