export interface ISideDrawerData {
  name: string;
  clearHistory: boolean;
  styles: any;
}

export interface ISideDrawerHeaderData {
  icon: string;
  iconIsCircular: boolean;
  disableIconText: boolean;
  headline: string;
  subHeadline: string;
  action: string;
  alignment: string;
}

export interface ISideDrawerSectionData {
  name: string;
  caption: string;
  visible: boolean;
  preserveImageSpacing: boolean;
  separatorEnabled: boolean;
  styles: any;
}

export interface ISideDrawerItemData {
  name: string;
  image: string;
  title: string;
  action: string;
  visible: boolean;
  resetIfPressedWhenActive: boolean;
  pageToOpen: string;
  textAlignment: string;
  styles: any;
}