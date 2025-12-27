import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-picker';

/**
 * Resize and convert image to base64
 * Reduces bandwidth by scaling large images
 */
export const prepareImageForAI = async (uri: string, maxSize: number = 1024): Promise<string> => {
    try {
        // Resize the image to reduce size
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: maxSize } }],
            { compress: 0.8, format: SaveFormat.JPEG }
        );

        // Read as base64
        const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Return with data URL prefix
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error('Error preparing image:', error);
        throw new Error('Failed to process image');
    }
};
