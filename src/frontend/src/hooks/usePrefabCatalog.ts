import { useQuery } from '@tanstack/react-query';

export interface PrefabEntry {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface PrefabCatalog {
  prefabs: PrefabEntry[];
}

export function usePrefabCatalog() {
  return useQuery<PrefabCatalog>({
    queryKey: ['prefabCatalog'],
    queryFn: async () => {
      const response = await fetch('/assets/prefabs/cactus-cowboy-prefabs.json');
      if (!response.ok) {
        throw new Error('Failed to load prefab catalog');
      }
      return response.json();
    },
    retry: 1,
    staleTime: Infinity, // Static data doesn't change
  });
}
