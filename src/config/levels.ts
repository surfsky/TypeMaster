export type Level = {
  id: string
  cat: string
  title: string
  text: string
  fontSize?: number
}

let levelsCache: Level[] | null = null;

export const getLevels = async (): Promise<Level[]> => {
  if (levelsCache) return levelsCache;
  try {
    const url = import.meta.env.DEV ? '/src/assets/levels.json' : '/assets/levels.json';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load levels');
    }
    levelsCache = await response.json();
    return levelsCache || [];
  } catch (error) {
    console.error('Error loading levels:', error);
    return [];
  }
};

// Keep this for backward compatibility if needed, but it will be empty initially
export const levels: Level[] = [];
