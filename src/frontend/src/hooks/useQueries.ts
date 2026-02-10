import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ProcessSelector, AvailableProcesses } from '../backend';

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

export function useGetItemSpawner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['itemSpawner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getItemSpawner();
      return result || { items: [] };
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
    refetchInterval: 30000, // Poll every 30 seconds
    retry: false,
  });
}
