export const extractJsonObjectFromText = (text: string): string => {
    const trimmed = text.trim();

    // Strip common fenced blocks: ```json ... ``` or ``` ... ```
    const withoutFences = trimmed
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '');

    const firstBrace = withoutFences.indexOf('{');
    const lastBrace = withoutFences.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return withoutFences.trim();
    }

    return withoutFences.slice(firstBrace, lastBrace + 1).trim();
};
