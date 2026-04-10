

export const parseAnswer = (response: string): string => {
    // regex 's' flag allows matching across multiple lines, \s* handles potential newlines/spaces
    const match = response.match(/\*\*\*\s*({.*})\s*\*\*\*/s);
    if (match && match[1]) {
        try {
            const jsonString = match[1]
                .replace(/Boolean|True/g, 'true')
                .replace(/Boolean|False/g, 'false')
                .trim();
            const parsed = JSON.parse(jsonString);
            return parsed.answer || '';
        } catch (e) {
            console.error("Failed to parse bot JSON in frontend:", e);
            // Fallback: If JSON parsing fails, try to return everything between triple asterisks as raw text
            return match[1].trim();
        }
    }
    return '';
};