
const enum SoftKeyboardType {
  Implicit,
  Show,
  Hide
}

export class Util {
  public static toSoftKeyboardType(keyboardVisibility: string) {
    let type = SoftKeyboardType.Implicit;

    if (keyboardVisibility) {
      if (keyboardVisibility === 'AlwaysShow') {
        type = SoftKeyboardType.Show;
      } else if (keyboardVisibility === 'AlwaysHide') {
        type = SoftKeyboardType.Hide;
      }
    }
    return type;
  }

   public static getPopoverOnPress(onPress: any) {
      var onPressValue = onPress;
      try {
          onPressValue = JSON.parse(onPress);
      }
      catch (e) {}
      if (!onPressValue) {
          onPressValue = onPress;
      }
      return onPressValue;
   }
};
