import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { guessMimeTypeFromUri } from '../../utils/media';

export interface GeminiFile {
    name: string; // e.g. files/abc-123
    uri: string;  // file URI used in prompts
    mimeType?: string;
    state?: 'STATE_UNSPECIFIED' | 'PROCESSING' | 'ACTIVE' | 'FAILED';
    error?: { message?: string };
}

const getApiKey = () => {
    const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!key) throw new Error('Missing Gemini API key. Set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
    return key;
};

export const uploadFileToGemini = async (localUri: string, displayName?: string): Promise<GeminiFile> => {
    const apiKey = getApiKey();
    const mimeType = guessMimeTypeFromUri(localUri);

    // Uses the "media upload" endpoint. In Expo, BINARY_CONTENT streams the file from disk.
    const uploadUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${encodeURIComponent(apiKey)}`;

    let status: number;
    let bodyText: string;

    if (Platform.OS === 'web') {
        const blobRes = await fetch(localUri);
        const blob = await blobRes.blob();

        const res = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'X-Goog-Upload-Protocol': 'raw',
                // Web path: request asked for start/upload/finalize semantics.
                'X-Goog-Upload-Command': 'start, upload, finalize',
                'Content-Type': mimeType,
                ...(displayName ? { 'X-Goog-Upload-File-Name': displayName } : {}),
            },
            body: blob,
        });

        status = res.status;
        bodyText = await res.text();
    } else {
        const res = await FileSystem.uploadAsync(uploadUrl, localUri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
                'X-Goog-Upload-Protocol': 'raw',
                'X-Goog-Upload-Command': 'upload, finalize',
                'Content-Type': mimeType,
                ...(displayName ? { 'X-Goog-Upload-File-Name': displayName } : {}),
            },
        });

        status = res.status;
        bodyText = res.body;
    }

    if (status < 200 || status >= 300) {
        throw new Error(`Gemini Files API upload failed (${status}): ${bodyText?.slice(0, 200)}`);
    }

    const parsed = JSON.parse(bodyText);
    const file: GeminiFile = parsed.file ?? parsed;
    if (!file?.name || !file?.uri) {
        throw new Error('Gemini Files API upload returned unexpected response.');
    }
    file.mimeType = file.mimeType ?? mimeType;
    return file;
};

export const getGeminiFile = async (name: string): Promise<GeminiFile> => {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/${name}?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Gemini Files API get failed (${res.status})`);
    }
    return (await res.json()) as GeminiFile;
};

export const deleteGeminiFile = async (name: string): Promise<void> => {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/${name}?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`Gemini Files API delete failed (${res.status})`);
    }
};

export const waitForGeminiFileActive = async (
    name: string,
    onStatus?: (s: string) => void,
    timeoutMs = 60_000,
    pollEveryMs = 2_000
): Promise<GeminiFile> => {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        const file = await getGeminiFile(name);

        if (file.state === 'ACTIVE') return file;
        if (file.state === 'FAILED') {
            throw new Error(file.error?.message || 'Video-Verarbeitung fehlgeschlagen.');
        }

        onStatus?.('Video wird verarbeitet...');
        await new Promise((r) => setTimeout(r, pollEveryMs));
    }

    throw new Error('Timeout: Video wurde nicht rechtzeitig aktiv.');
};
