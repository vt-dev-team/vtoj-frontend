export interface VWebsiteSettings {
    title: string;
}

export interface VUISettings {
    language: string;
    theme: string;
}

export interface VSettings {
    website: VWebsiteSettings;
    ui: VUISettings;
    status: number;
    errorMessage?: string;
}