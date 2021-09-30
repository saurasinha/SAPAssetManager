export declare class ActivityHandler {
    static onCreate(savedInstanceState: any, context: android.content.Context): void;
    static onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent, context: android.content.Context): void;
    static onRequestPermissionsResult(requestCode: number, permissions: Array<String>, grantResults: Array<number>, context: android.content.Context): void;
    private static bridge;
}
