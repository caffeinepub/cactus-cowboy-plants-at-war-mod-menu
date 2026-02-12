import { useGetItemSpawner, useAddItem } from './useQueries';

export function useItemSpawner() {
  const { data: itemSpawner } = useGetItemSpawner();
  const { mutateAsync: addItemMutation, isPending: isAdding } = useAddItem();

  const items = itemSpawner?.items || [];

  const addItem = async (name: string) => {
    await addItemMutation(name);
  };

  return {
    items,
    addItem,
    isAdding,
  };
}
