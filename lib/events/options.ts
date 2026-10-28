export const eventCategories = ["Fitness", "Outdoors", "Arts and crafts", "Concert", "Sports", "Performance", "Community service", "Social/networking", "Marketplace", "Educational"] as const;
export const eventAudiences = ["Kid-friendly", "Family-friendly", "18+", "21+"] as const;
export function wordCount(value: string) { return value.trim() ? value.trim().split(/\s+/u).length : 0; }
