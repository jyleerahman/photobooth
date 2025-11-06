/// <reference types="vite/client" />

// ClipboardItem type declaration for image clipboard support
interface ClipboardItem {
    readonly types: string[];
    readonly presentationStyle: 'unspecified' | 'inline' | 'attachment';
    getType(type: string): Promise<Blob>;
}

declare var ClipboardItem: {
    prototype: ClipboardItem;
    new(items: Record<string, Blob | Promise<Blob>>): ClipboardItem;
};
