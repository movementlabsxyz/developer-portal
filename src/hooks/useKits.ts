import { useMemo } from 'react';
import kitsData from '../../content/kits.json';

export interface Kit {
  id: string;
  name: string;
  description: string;
  tags: string[];
  docsLink: string;
  replitLink: string;
  icon: string;
  featured: boolean;
}

export interface KitsData {
  kits: Kit[];
}

export function useKits() {
  const data: KitsData = useMemo(() => kitsData as KitsData, []);

  const featuredKits = useMemo(
    () => data.kits.filter((kit) => kit.featured),
    [data.kits]
  );

  const allKits = useMemo(() => data.kits, [data.kits]);

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
    featuredKits,
    getKitsByTag,
    allTags: getAllTags,
  };
}
