export class OpenDocument {
    public static getInstance(): OpenDocument {
        return null;
    }

    public openWithPath(pressedControlView, path): any {
        return new Promise((resolve, reject) => reject('stub'));
    }

    public clearCache(): void {
        return;
    }
};
