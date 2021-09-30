import { ToolbarLabel as ToolbarLabelDefinition } from './toolbar-label';
import { Label } from 'tns-core-modules/ui/label';
import { CSSType, fontSizeProperty } from 'tns-core-modules/ui/text-base';
import { Property } from 'tns-core-modules/ui/core/view';

export * from 'tns-core-modules/ui/label';

@CSSType('ToolbarLabel')
export class ToolbarLabel extends Label implements ToolbarLabelDefinition {
    public fontSizeUnit: string;

    // To override fontSizeProperty setter function from TextBase
    public [fontSizeProperty.setNative](value: any | { nativeSize: number }) {
        let fontSizeUnitToBeUsed = android.util.TypedValue.COMPLEX_UNIT_PX;
        if (this.fontSizeUnit) {
            if (this.fontSizeUnit.toLowerCase() === 'sp') {
                fontSizeUnitToBeUsed = android.util.TypedValue.COMPLEX_UNIT_SP;
            }
        }
        if (typeof value === 'number') {
            this.nativeViewProtected.setTextSize(fontSizeUnitToBeUsed, value);
        } else {
            this.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }
}

let fontSizeUnitProperty = new Property<ToolbarLabel, string>({ 
    defaultValue: '', name: 'fontSizeUnit', valueChanged: (target, oldValue, newValue) => {
        target.fontSizeUnit = newValue;
    },
});
fontSizeUnitProperty.register(ToolbarLabel);
