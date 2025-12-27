/**
 * Google File API Helper
 * Handles video upload and polling for the Gemini API
 */

export interface FileUploadResponse {
    file: {
        name: string;
        displayName: string;
        mimeType: string;
        sizeBytes: string;
        createTime: string;
        updateTime: string;
        expirationTime: string;
        sha256Hash: string;
        uri: string;
        state: 'PROCESSING' | 'ACTIVE' | 'FAILED';
        error?: {
            code: number;
            message: string;
        };
    };
}

/**
 * Upload a video file to Google File API
 * Uses multipart form data upload
 */
export const uploadVideoFile = async (
    videoUri: string,
    mimeType: string,
    apiKey: string
): Promise<FileUploadResponse> => {
    try {
        // Read the file as blob
        const response = await fetch(videoUri);
        const blob = await response.blob();

        // Create form data
        const formData = new FormData();
        formData.append('file', blob, 'video.mp4');

        // Upload to Google File API
        const uploadResponse = await fetch(
            `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!uploadResponse.ok) {
            const error = await uploadResponse.text();
            throw new Error(`File upload failed: ${error}`);
        }

        const result = await uploadResponse.json();
        return result as FileUploadResponse;
    } catch (error) {
        console.error('Error uploading video file:', error);
        throw new Error('Failed to upload video file');
    }
};

/**
 * Poll the file status until it's ACTIVE or FAILED
 * @param fileName - The file name from the upload response (e.g., "files/xyz")
 * @param apiKey - Gemini API key
 * @param maxAttempts - Maximum number of polling attempts (default: 30)
 * @param delayMs - Delay between attempts in milliseconds (default: 2000)
 */
export const waitForFileActive = async (
    fileName: string,
    apiKey: string,
    maxAttempts: number = 30,
    delayMs: number = 2000
): Promise<FileUploadResponse> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${apiKey}`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get file status: ${response.statusText}`);
            }

            const result = (await response.json()) as FileUploadResponse;

            if (result.file.state === 'ACTIVE') {
                return result;
            }

            if (result.file.state === 'FAILED') {
                throw new Error(`File processing failed: ${result.file.error?.message || 'Unknown error'}`);
            }

            // Still PROCESSING, wait and retry
            await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
            console.error(`Polling attempt ${attempt + 1} failed:`, error);
            if (attempt === maxAttempts - 1) {
                throw new Error('File processing timeout');
            }
        }
    }

    throw new Error('File processing timeout');
};

/**
 * Delete a file from Google File API
 * Should be called after successful recipe generation for privacy
 */
export const deleteFile = async (
    fileName: string,
    apiKey: string
): Promise<void> => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${apiKey}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            console.warn(`Failed to delete file ${fileName}:`, response.statusText);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        // Don't throw - file will expire automatically
    }
};
