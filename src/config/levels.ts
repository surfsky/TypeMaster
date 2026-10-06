export type Level = {
  id: string
  cat: string
  title: string
  text: string
  textLines?: string[]
  commentString?: string | string[]
  fontSize?: number
}

type RawLevel = Omit<Level, 'text'> & {
  text?: string
  CommentString?: string | string[]
}

let levelsCache: Level[] | null = null;

/**Normalize level text */
function normalizeLevel(item: RawLevel): Level {
  const text = Array.isArray(item.textLines)
    ? item.textLines.join('\n')
    : (item.text || '')

  return {
    ...item,
    commentString: item.commentString || item.CommentString,
    text,
  }
}

/**Normalize level list */
function normalizeLevels(items: RawLevel[]): Level[] {
  return items.map(normalizeLevel)
}

export const getLevels = async (): Promise<Level[]> => {
  if (levelsCache) return levelsCache;
  try {
    const url = import.meta.env.DEV ? '/src/assets/levels.json' : '/assets/levels.json';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load levels');
    }
    const items = await response.json() as RawLevel[];
    levelsCache = normalizeLevels(items);
    return levelsCache || [];
  } catch (error) {
    console.error('Error loading levels:', error);
    return [];
  }
};

// Keep this for backward compatibility if needed, but it will be empty initially
export const levels: Level[] = [];
