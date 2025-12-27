import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export const uriToBase64 = async (uri: string): Promise<string> => {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
};

export const guessMimeTypeFromUri = (uri: string): string => {
    const lower = uri.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.mp4')) return 'video/mp4';
    if (lower.endsWith('.mov')) return 'video/quicktime';
    return 'application/octet-stream';
};

export const prepareImageForUpload = async (uri: string): Promise<{ uri: string; mimeType: string }> => {
    // Scale down to max 1024px edge length for bandwidth & faster uploads.
    // Keep it simple: only resize if larger than 1024.
    const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );

    return { uri: result.uri, mimeType: 'image/jpeg' };
};
