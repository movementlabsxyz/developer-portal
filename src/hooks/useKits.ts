import { useMemo } from 'react';
import kitsData from '../../content/kits.json';

export interface Kit {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubLink: string;
  replitLink: string;
  type: 'app' | 'module';
}

export interface KitsData {
  kits: Kit[];
}

export function useKits() {
  const data: KitsData = useMemo(() => kitsData as KitsData, []);

  const allKits = useMemo(() => data.kits, [data.kits]);

  const getKitsByType = useMemo(
    () => (type: 'app' | 'module') => data.kits.filter((kit) => kit.type === type),
    [data.kits]
  );

  const getKitsByTag = useMemo(
    () => (tag: string) => data.kits.filter((kit) => kit.tags.includes(tag)),
    [data.kits]
  );

  const getAllTags = useMemo(() => {
    const tags = new Set<string>();
    data.kits.forEach((kit) => {
      kit.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data.kits]);

  return {
    kits: allKits,
    getKitsByType,
    getKitsByTag,
    allTags: getAllTags,
  };
}
