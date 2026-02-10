import { useState } from 'react';
import { useGetItemSpawner, useAddItem } from './useQueries';

export function useItemSpawner() {
  const { data: itemSpawner } = useGetItemSpawner();
  const { mutateAsync: addItemMutation, isPending: isAdding } = useAddItem();
  const [spawnLogs, setSpawnLogs] = useState<string[]>([]);

  const items = itemSpawner?.items || [];

  const addItem = async (name: string) => {
    await addItemMutation(name);
  };

  const logSpawn = (itemName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSpawnLogs(prev => [...prev, `${timestamp} - Spawned: ${itemName}`]);
  };

  return {
    items,
    addItem,
    isAdding,
    spawnLogs,
    logSpawn,
  };
}
