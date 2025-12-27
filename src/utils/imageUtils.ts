import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface ImagePrepOptions {
    maxSize?: number;
    compress?: number;
    format?: SaveFormat;
}

/**
 * Resize and convert image to base64
 * Reduces bandwidth by scaling large images
 */
export const prepareImageForAI = async (
    uri: string, 
    options: ImagePrepOptions = {}
): Promise<string> => {
    const { 
        maxSize = 1024, 
        compress = 0.8, 
        format = SaveFormat.JPEG 
    } = options;

    try {
        // Resize the image to reduce size
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: maxSize } }],
            { compress, format }
        );

        // Read as base64
        const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
            encoding: 'base64',
        });

        // Determine MIME type based on format
        const mimeType = format === SaveFormat.PNG ? 'image/png' : 'image/jpeg';

        // Return with data URL prefix
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error preparing image:', error);
        throw new Error('Failed to process image');
    }
};
