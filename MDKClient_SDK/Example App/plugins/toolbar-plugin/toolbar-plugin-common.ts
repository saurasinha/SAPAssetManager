import { 
    ToolBar as ToolBarDefinition,
    ToolBarItems as ToolBarItemsDefinition,
    ToolBarItem as ToolBarItemDefinition,
    SystemItem as SystemItemDefinition,
    ItemType as ItemTypeDefinition } from 'toolbar-plugin';
import { Visibility } from 'tns-core-modules/ui/styling/style-properties';
import { profile } from 'tns-core-modules/profiling';
import * as app from 'tns-core-modules/application';

import { View, ViewBase, Property, unsetValue, booleanConverter, 
    horizontalAlignmentProperty, verticalAlignmentProperty } from 'tns-core-modules/ui/core/view';

import { CpmsSession } from 'mdk-sap';
import { Cache } from 'tns-core-modules/ui/image-cache';
import { path, knownFolders, Folder, File } from 'tns-core-modules/file-system';
import { fromFileOrResource, fromBase64, ImageSource, 
    fromNativeSource, fromFile } from 'tns-core-modules/image-source';
import { isDataURI, isFileOrResourcePath, isFontIconURI } from 'tns-core-modules/utils/utils';
import { Font } from 'tns-core-modules/ui/styling/font';
import { HttpResponse } from 'mdk-sap';
    
const cache = new Cache();

export * from 'tns-core-modules/ui/core/view';

export class ToolBarBase extends View implements ToolBarDefinition {
    
    public ios: any /* UIToolbar */;
    public barPosition: number;
    private _toolbarItems: ToolBarItems;
    private _itemDisabledStyle: any;
    private _containedItemStyle: any;
    private _containedItemDisabledStyle: any;
    private _itemFontIconStyle: any;
    private _iconFontSize: number = 24;
    
    get barItems(): ToolBarItems {
        return this._toolbarItems;
    }
    set barItems(value: ToolBarItems) {
        throw new Error('barItems property is read-only');
    }

    get itemDisabledStyle(): any {
        return this._itemDisabledStyle;
    }
    set itemDisabledStyle(style: any) {
        this._itemDisabledStyle = style;
    }

    get containedItemStyle(): any {
        return this._containedItemStyle;
    }
    set containedItemStyle(style: any) {
        this._containedItemStyle = style;
    }

    get containedItemDisabledStyle(): any {
        return this._containedItemDisabledStyle;
    }
    set containedItemDisabledStyle(style: any) {
        this._containedItemDisabledStyle = style;
    }

    get itemFontIconStyle(): any {
        return this._itemFontIconStyle;
    }
    set itemFontIconStyle(style: any) {
        this._itemFontIconStyle = style;
    }

    get _childrenCount(): number {
        let actionViewsCount = 0;
        this._toolbarItems.getItems().forEach((actionItem) => {
            actionViewsCount++;
        });

        return actionViewsCount;
    }

    get android(): any {
        return undefined;
    }

    constructor() {
        super();
        this._toolbarItems = new ToolBarItems(this);
    }

    public update() {
        // 
    }
    
    public _onPositionChanged() {
        //
    }

    public eachChild(callback: (child: ViewBase) => boolean) {
        this.barItems.getItems().forEach((item) => {
            callback(item);
        });
    }
    
    protected _isEmpty(): boolean {
        if (this.barItems.getItems().length > 0) {
            return false;
        }

        return true;
    }

    protected getImageSourceFromIcon(icon: string, style?: any): Promise<ImageSource> {

        let fileExtension: string;
        let imgSourcePromise: Promise<ImageSource> = Promise.resolve(null);
        let dispImgSource: ImageSource;
        
        if (icon.lastIndexOf('https', 0) === 0) {
            let cachedImageSource = cache.get(icon);
            if (cachedImageSource) {
                // Convert native image stored in cache to ImageSource
                imgSourcePromise = Promise.resolve(fromNativeSource(cachedImageSource));
            } else {
                return CpmsSession.getInstance().sendRequest(icon)
                .then((responseAndData) => {
                    let mimeType = HttpResponse.getMimeType(responseAndData);
                    let statusCode = HttpResponse.getStatusCode(responseAndData);

                    if (statusCode >= 400 || mimeType.indexOf('image') === -1) {
                        return null;
                    }

                    let image = HttpResponse.toImage(responseAndData);
                    dispImgSource = fromNativeSource(image);

                    if (app.android) {
                        cache.set(icon, dispImgSource.android);
                    } else if (app.ios) {
                        fileExtension = mimeType.substring(mimeType.lastIndexOf('/') + 1);
                        dispImgSource = this.resizeAndSaveImageSourceToFile(dispImgSource, icon, fileExtension);
                        cache.set(icon, dispImgSource.ios);
                    }

                    return dispImgSource;

                })
                .catch(() => {
                    return null;
                });
            }
        } else if (isDataURI(icon)) {
            const base64Data = icon.split(',')[1];
            if (base64Data !== undefined) {
                dispImgSource = ImageSource.fromBase64Sync(base64Data);

                if (app.ios) {
                    if (icon.lastIndexOf('data:image/png', 0) === 0) {
                        fileExtension = 'png';
                    } else if (icon.lastIndexOf('data:image/jpg', 0) === 0) {
                        fileExtension = 'jpg';
                    } else if (icon.lastIndexOf('data:image/jpeg', 0) === 0) {
                        fileExtension = 'jpeg';
                    } 
                    dispImgSource = this.resizeAndSaveImageSourceToFile(dispImgSource, icon, fileExtension); 
                }  
                imgSourcePromise = Promise.resolve(dispImgSource); 
            }
        }  else if (isFileOrResourcePath(icon)) {
            dispImgSource = ImageSource.fromFileOrResourceSync(icon);
            imgSourcePromise = Promise.resolve(dispImgSource);
        } else if (isFontIconURI(icon)) {
            // To support font icon 'font://&#xe070;';
            let fontCode = icon.replace('font://&#', '0').replace(';', '');
            if (fontCode !== '') {
                let fontCodeNum;
                if (typeof fontCode === 'string') {
                    fontCodeNum = Number(fontCode);
                }
                if (fontCodeNum) {
                    const fontCodeString = `font://${String.fromCharCode(fontCodeNum)}`;
                    const fontIconCode = fontCodeString.split('//')[1];
                    let itemStyle = style && style.color ? style : this.itemFontIconStyle;
                    let font = Font.default.withFontFamily('SAP-icons');
                    // BCP-2080169920 use the font size = 24 to fix the iOS font icon size issue.
                    if (app.ios) {
                        font = font.withFontSize(this._iconFontSize);      
                    }
                    dispImgSource = ImageSource.fromFontIconCodeSync(fontIconCode, font, itemStyle.color);
            
                    imgSourcePromise = Promise.resolve(dispImgSource);
                }
            }
        }
        return imgSourcePromise;
    }

    /* 
    Moving the resizing logic to common place, since it will be required for all types of images.

    Every UIBarButton item has padding on both sides of it in iOS. The amount of padding increases with the 
    dimensions of the image as a result the contents of the toolbar on either sides of the barbutton
    containing the image get shifted causing some of the toolbar items to get hidden. 
    
    So, images are resized, saved to the Documents folder and then retrieved. 
    This makes the images suitable to create a UIBarButtonItem out of them. The image dimensions 
    have been picked up from 
    https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/custom-icons/
    */

    private resizeAndSaveImageSourceToFile(dispImgSource: ImageSource, icon: string, 
                                           fileExtension: string): ImageSource {

        let saved: boolean = false;

        if (dispImgSource) {
            if (dispImgSource.ios) {
                
                let folderDest = knownFolders.documents();                                                    
                let fileName = this.returnFileName(folderDest);
                let pathDest = path.join(folderDest.path, fileName);
                let resizedImage: UIImage = this.resizeImage(dispImgSource.ios);
                dispImgSource = fromNativeSource(resizedImage);

                switch (fileExtension) {
                    case 'jpg':
                        pathDest = pathDest + '.jpg';
                        saved = dispImgSource.saveToFile(pathDest, 'jpg');
                        break;
                        case 'jpeg': 
                        pathDest = pathDest + '.jpeg';
                        saved = dispImgSource.saveToFile(pathDest, 'jpeg');
                        break; 
                        case 'png':  
                        pathDest = pathDest + '.png';
                        saved = dispImgSource.saveToFile(pathDest, 'png');
                        break;
                    default:
                        dispImgSource = undefined;
                        break;
                }

    /* 
        Fix for BCP-2070104755 
        fromFile() internally calls UIImage.imageWithContentsOfFile for creating an ImageSource object from a 
        file path. UIImage.imageWithContentsOfFile keeps the file open as long as the UIImage it was used to 
        create is still alive. As a result, deleting the file using imgFile.removeSync() causes issues with
        the rendering of the png images on the toolbar. So at first creating the NSData object, and then
        creating the UIImage and then the ImageSource object out of it. 
        More information can be found at                     
        https://stackoverflow.com/questions/56599471/deleting-and-image-and-re-writing-it-back-again-produces-errors
    */   
                if (saved) {
                    let imgData: NSData = NSData.dataWithContentsOfFile(pathDest);
                    dispImgSource = new ImageSource(UIImage.imageWithData(imgData));
                    const imgFile: File = File.fromPath(pathDest);
                    imgFile.removeSync();
                }
            } 
        }
        return dispImgSource;
    }

    private resizeImage(image: UIImage): UIImage {
        let newSize = CGSizeMake(24, 24);
        UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
        image.drawInRect(CGRectMake(0, 0, newSize.width, newSize.height));
        let newImage: UIImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return newImage;
    }

    private returnFileName(currentFolder: Folder): string {

        let fileName: string;
        let fileNames = [];
        let entities = currentFolder.getEntitiesSync();
        entities.forEach((entity) => {
            fileNames.push(entity.name.substring(0, entity.name.lastIndexOf('.')));
        });
        fileName = fileNames[0];
        while (fileNames.indexOf(fileName) !== -1) {
            fileName = (Math.floor(Math.random() * 100) + 1).toString();
        }
        return fileName;
    }
}

export class ToolBarItems implements ToolBarItemsDefinition {
    private _items = new Array<ToolBarItemDefinition>();
    private _toolBar: ToolBarDefinition;

    constructor(toolBar: ToolBarDefinition) {
        this._toolBar = toolBar;
    }

    public addItem(item: ToolBarItemDefinition): void {
        if (!item) {
            throw new Error('Cannot add empty item');
        }

        this._items.push(item);
        item.toolBar = this._toolBar;
        this._toolBar._addView(item);
    }

    public removeItem(item: ToolBarItemDefinition): void {
        if (!item) {
            throw new Error('Cannot remove empty item');
        }

        const itemIndex = this._items.indexOf(item);
        if (itemIndex < 0) {
            throw new Error('Cannot find item to remove');
        }

        this._items.splice(itemIndex, 1);
        this._toolBar._removeView(item);

        item.toolBar = undefined;
    }

    public getItems(): Array<ToolBarItemDefinition> {
        return this._items.slice();
    }

    public getVisibleItems(): Array<ToolBarItemDefinition> {
        const visibleItems = [];
        this._items.forEach((item) => {
            if (isVisible(item)) {
                visibleItems.push(item);
            }
        });

        return visibleItems;
    }

    public getItemAt(index: number): ToolBarItemDefinition {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }

        return this._items[index];
    }

    public setItems(items: Array<ToolBarItemDefinition>) {
        
        // Remove all existing items
        while (this._items.length > 0) {
            this.removeItem(this._items[this._items.length - 1]);
        }

        // Add new items
        for (let i of items){
            this.addItem(i);
        }       
    }
}

export class ToolBarItemBase extends View implements ToolBarItemDefinition {
    
    public static tapEvent = 'tap';

    public android: any;
    public _toolBar: ToolBarDefinition;
    
    public text: string;
    public itemStyle: any;
    public icon: string;
    public visibility: Visibility;
    public enabled: boolean;
    public clickable: boolean;
    public tag: number;
    public width: number;
    public systemItem: string;
    public itemType: string;
    public name: string;

    private _actionView: View;
    private _spacingActionView: View;

    get actionView(): View {
        return this._actionView;
    }
    set actionView(value: View) {
        if (this._actionView !== value) {
            this.setActionView(value);

            if (this._toolBar) {
                this._toolBar.update();
            }
        }
    }

    get spacingActionView(): View {
        return this._spacingActionView;
    }
    set spacingActionView(value: View) {
        if (this._spacingActionView !== value) {
            this.setSpacingActionView(value);

            if (this._toolBar) {
                this._toolBar.update();
            }
        }
    }

    get toolBar(): ToolBarDefinition {
        return this._toolBar;
    }
    set toolBar(value: ToolBarDefinition) {
        if (value !== this._toolBar) {
            this._toolBar = value;
        }
    }

    @profile
    public onLoaded() {
        if (this._actionView) {
            this._actionView.style[horizontalAlignmentProperty.cssName] = 'center';
            this._actionView.style[verticalAlignmentProperty.cssName] = 'middle';
        }
        if (this._spacingActionView) {
            this._spacingActionView.style[horizontalAlignmentProperty.cssName] = 'center';
            this._spacingActionView.style[verticalAlignmentProperty.cssName] = 'middle';
        }
        super.onLoaded();
    }

    public _addChildFromBuilder(name: string, value: any) {
        this.actionView = value;
    }

    public eachChild(callback: (child: ViewBase) => boolean) {
        if (this._actionView) {
            callback(this._actionView);
        }
    }

    public setActionView(value: View) {
        if (this._actionView !== value) {
            if (this._actionView) {
                this._actionView.style[horizontalAlignmentProperty.cssName] = unsetValue;
                this._actionView.style[verticalAlignmentProperty.cssName] = unsetValue;
                this._removeView(this._actionView);
            }

            this._actionView = value;

            if (this._actionView) {
                this._addView(this._actionView);
            }
        }
    }

    public setSpacingActionView(value: View) {
        if (this._spacingActionView !== value) {
            if (this._spacingActionView) {
                this._spacingActionView.style[horizontalAlignmentProperty.cssName] = unsetValue;
                this._spacingActionView.style[verticalAlignmentProperty.cssName] = unsetValue;
                this._removeView(this._spacingActionView);
            }

            this._spacingActionView = value;

            if (this._spacingActionView) {
                this._addView(this._spacingActionView);
            }
        }
    }
}

export function isVisible(item: ToolBarItemDefinition) {
    return item.visibility === 'visible';
}

function onBarPropertyChanged(toolBar: ToolBarBase, oldValue: number, newValue: number) {
    toolBar._onPositionChanged();
}

let barPositionProperty = new Property<ToolBarBase, number>({ 
    defaultValue: app.ios ? UIBarPosition.Any : 0, name: 'barPosition', valueChanged: onBarPropertyChanged });
barPositionProperty.register(ToolBarBase);

function onItemChanged(item: ToolBarItemBase, oldValue: any, newValue: any) {
    if (item.toolBar) {
        item.toolBar.update();
    }
}

let textProperty = new Property<ToolBarItemBase, string>({ 
    defaultValue: '', name: 'text', valueChanged: onItemChanged });
textProperty.register(ToolBarItemBase);

let itemStyleProperty = new Property<ToolBarItemBase, any>({ 
    defaultValue: null, name: 'itemStyle', valueChanged: onItemChanged });
itemStyleProperty.register(ToolBarItemBase);

let iconProperty = new Property<ToolBarItemBase, string>({ 
    defaultValue: null, name: 'icon', valueChanged: onItemChanged });
iconProperty.register(ToolBarItemBase);

let visibilityProperty = new Property<ToolBarItemBase, Visibility>({ 
    defaultValue: 'visible', name: 'visibility', valueChanged: onItemChanged });
visibilityProperty.register(ToolBarItemBase);

let enabledProperty = new Property<ToolBarItemBase, boolean>({ 
    defaultValue: true, name: 'enabled', valueChanged: onItemChanged });
enabledProperty.register(ToolBarItemBase);

let clickableProperty = new Property<ToolBarItemBase, boolean>({ 
    defaultValue: true, name: 'clickable', valueChanged: onItemChanged });
clickableProperty.register(ToolBarItemBase);

let tagProperty = new Property<ToolBarItemBase, number>({ 
    defaultValue: 0, name: 'tag', valueChanged: onItemChanged });
tagProperty.register(ToolBarItemBase);

let widthProperty = new Property<ToolBarItemBase, number>({ 
    defaultValue: 0.0, name: 'width', valueChanged: onItemChanged });
widthProperty.register(ToolBarItemBase);

let systemItemProperty = new Property<ToolBarItemBase, string>({ 
    defaultValue: undefined, name: 'systemItem', valueChanged: onItemChanged });
systemItemProperty.register(ToolBarItemBase);

let itemTypeProperty = new Property<ToolBarItemBase, string>({ 
    defaultValue: 'normal', name: 'itemType', valueChanged: onItemChanged });
    itemTypeProperty.register(ToolBarItemBase);

let nameProperty = new Property<ToolBarItemBase, string>({ 
    defaultValue: '', name: 'name', valueChanged: onItemChanged });
    nameProperty.register(ToolBarItemBase);

let toolbarProperty = new Property<ToolBarItemBase, ToolBarBase>({ 
    defaultValue: null, name: '_toolbar', valueChanged: onItemChanged });
toolbarProperty.register(ToolBarItemBase);

export class SystemItemBase implements SystemItemDefinition {
    public static isValid(key: string): Boolean {
        if (this.systemItemEnum) {
            let item = Object.keys(this.systemItemEnum).filter(k => k === key);
            return item ? item.length > 0 : false;
        }
        return false;
    }

    public static parse(key: string, style?: string): any {
        if (this.isValid(key)) {
            return this.systemItemEnum[key];
        }
        return undefined;
    }

    static get systemItemEnum(): any {
        return undefined;
    }
}

export class ItemTypeBase implements ItemTypeDefinition {
    public static isValid(key: string): Boolean {
        if (this.itemTypeEnum) {
            let item = Object.keys(this.itemTypeEnum).filter(k => k === key);
            return item ? item.length > 0 : false;
        }
        return false;
    }

    public static parse(key: string): any {
        if (this.isValid(key)) {
            return this.itemTypeEnum[key];
        }
        return undefined;
    }

    static get itemTypeEnum(): any {
        return undefined;
    }
}
