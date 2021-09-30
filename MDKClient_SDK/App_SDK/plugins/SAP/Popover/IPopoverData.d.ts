export interface IPopoverItemData {
  enabled: boolean;
  icon: string;
  onPress: string;
  title: string;
  visible: boolean;
}

export interface IPopoverData {
  items: Array<IPopoverItemData>;
  message: string;
  onPress: string;
  // This should be typed as IMDKPage, but some refactoring is needed to avoid circular references.
  page: any;
  title: string;
  visible: boolean;
}
