import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ProcessSelector, AvailableProcesses, ModSettings, Item, Prefab } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateModSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: ModSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateModSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetItemSpawner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['itemSpawner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getItemSpawner();
      return result || { items: [], spawnHistory: [] };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemName: string) => {
      if (!actor) throw new Error('Actor not available');
      const typeId = Math.floor(Math.random() * 1000);
      return actor.addItem({ name: itemName, typeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSpawner'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useClearItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearItems();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSpawner'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRemoveItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemName: string) => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('Profile not found');
      
      const updatedItems = profile.itemSpawner.items.filter(item => item.name !== itemName);
      await actor.saveCallerUserProfile({
        ...profile,
        itemSpawner: {
          ...profile.itemSpawner,
          items: updatedItems,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSpawner'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddSpawnHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSpawnHistory(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSpawner'] });
    },
  });
}

export function useGetProcessSelector() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProcessSelector>({
    queryKey: ['processSelector'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProcessSelector();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetProcessSelector() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (processSelector: ProcessSelector) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProcessSelector(processSelector);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processSelector'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAvailableProcesses() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AvailableProcesses>({
    queryKey: ['availableProcesses'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAvailableProcesses();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
    retry: false,
  });
}

export function useGetPrefabSpawner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['prefabSpawner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getPrefabSpawner();
      return result || { prefabs: [], spawnHistory: [] };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPrefab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefab: Prefab) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPrefab(prefab);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prefabSpawner'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useClearPrefabs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearPrefabs();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prefabSpawner'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddPrefabSpawnHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPrefabSpawnHistory(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prefabSpawner'] });
    },
  });
}
