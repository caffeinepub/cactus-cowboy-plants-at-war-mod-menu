import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useItemSpawner } from '../hooks/useItemSpawner';
import { useAddSpawnHistory, useClearItems, useRemoveItem } from '../hooks/useQueries';
import { Package, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export function ItemSpawnerPanel() {
  const { items, addItem, isAdding } = useItemSpawner();
  const { mutateAsync: addHistory } = useAddSpawnHistory();
  const { mutateAsync: clearItems, isPending: isClearing } = useClearItems();
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveItem();
  const [newItemName, setNewItemName] = useState('');
  const [spawnLogs, setSpawnLogs] = useState<string[]>([]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      await addItem(newItemName.trim());
      setNewItemName('');
      toast.success('Item added to spawn list');
    } catch (error) {
      toast.error('Failed to add item');
      console.error(error);
    }
  };

  const handleSpawnItem = async (itemName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp} - Spawned: ${itemName}`;
    
    try {
      await addHistory(logEntry);
      setSpawnLogs(prev => [logEntry, ...prev].slice(0, 20));
      toast.success(`Spawned: ${itemName}`);
    } catch (error) {
      toast.error('Failed to spawn item');
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemName: string) => {
    try {
      await removeItem(itemName);
      toast.success('Item removed from list');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearItems();
      toast.success('All items cleared');
    } catch (error) {
      toast.error('Failed to clear items');
      console.error(error);
    }
  };

  return (
    <Card className="border-2 border-[oklch(0.45_0.15_45)]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
          <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          ITEM SPAWNER
        </CardTitle>
        <CardDescription>Create and spawn custom items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="space-y-2">
          <Label htmlFor="newItem" className="text-sm sm:text-base font-bold">
            Add New Item
          </Label>
          <div className="flex gap-2">
            <Input
              id="newItem"
              placeholder="Enter item name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="border-2 h-10"
            />
            <Button
              type="submit"
              disabled={isAdding || !newItemName.trim()}
              className="shrink-0 font-bold"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </form>

        {/* Item List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base font-bold">
              Spawn List ({items.length})
            </Label>
            {items.length > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleClearAll}
                disabled={isClearing}
                className="h-8 text-xs font-bold"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[200px] border-2 rounded-lg p-2">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-xs sm:text-sm">No items in spawn list</p>
                <p className="text-xs mt-1">Add items above to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {item.typeId}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleSpawnItem(item.name)}
                        className="h-8 px-3 text-xs font-bold"
                      >
                        Spawn
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.name)}
                        disabled={isRemoving}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Spawn History */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-bold">
            Spawn History
          </Label>
          <ScrollArea className="h-[150px] border-2 rounded-lg p-2 bg-muted/20">
            {spawnLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-xs">No spawn history yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {spawnLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono p-1 bg-background/50 rounded border"
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
