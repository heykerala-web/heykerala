// Simple hash function to generate a seed from a string
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const getTourismImage = (name: string, category: string, width = 800, height = 600, seedOverride?: number) => {
    // Clean inputs
    const cleanName = name?.trim() || '';
    const cleanCategory = category?.trim() || '';

    // Construct prompt
    // e.g. "Varkala Cliff Beach Kerala scenic 8k realistic"
    const prompt = `${cleanName} ${cleanCategory} Kerala scenic tourism 8k realistic`.replace(/\s+/g, '%20');

    // Use Pollinations.ai for reliable dynamic images
    // If seedOverride is provided, use it. Otherwise generate a deterministic seed from the name.
    const seed = seedOverride !== undefined ? seedOverride : getHash(cleanName + cleanCategory);

    return `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
};

export const getFallbackImage = () => {
    return `https://image.pollinations.ai/prompt/Kerala%20Backwaters%20scenic?width=800&height=600&nologo=true`;
};
