import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePrefabCatalog } from '../hooks/usePrefabCatalog';
import { useAddPrefab, useAddPrefabSpawnHistory, useClearPrefabs, useGetPrefabSpawner } from '../hooks/useQueries';
import { Box, Search, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function PrefabSpawnerPanel() {
  const { data: catalog, isLoading: catalogLoading } = usePrefabCatalog();
  const { data: prefabSpawner } = useGetPrefabSpawner();
  const { mutateAsync: addPrefab, isPending: isAdding } = useAddPrefab();
  const { mutateAsync: addHistory } = useAddPrefabSpawnHistory();
  const { mutateAsync: clearPrefabs, isPending: isClearing } = useClearPrefabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [spawnLogs, setSpawnLogs] = useState<string[]>([]);

  const prefabs = prefabSpawner?.prefabs || [];

  const filteredCatalog = catalog?.prefabs.filter(
    (prefab) =>
      prefab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prefab.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prefab.category && prefab.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleAddPrefab = async (prefabId: string, prefabName: string) => {
    try {
      await addPrefab({
        name: prefabName,
        prefabId: prefabId,
        position: '0,0,0',
      });
      toast.success(`Added ${prefabName} to spawn list`);
    } catch (error) {
      toast.error('Failed to add prefab');
      console.error(error);
    }
  };

  const handleSpawnPrefab = async (prefabName: string, prefabId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp} - Spawned: ${prefabName} (${prefabId})`;
    
    try {
      await addHistory(logEntry);
      setSpawnLogs(prev => [logEntry, ...prev].slice(0, 20));
      toast.success(`Spawned: ${prefabName}`);
    } catch (error) {
      toast.error('Failed to spawn prefab');
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearPrefabs();
      toast.success('All prefabs cleared');
    } catch (error) {
      toast.error('Failed to clear prefabs');
      console.error(error);
    }
  };

  return (
    <Card className="border-2 border-[oklch(0.45_0.15_45)]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
          <Box className="h-5 w-5 sm:h-6 sm:w-6" />
          PREFAB SPAWNER
        </CardTitle>
        <CardDescription>Browse and spawn game prefabs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Catalog */}
        <div className="space-y-2">
          <Label htmlFor="prefabSearch" className="text-sm sm:text-base font-bold">
            Search Prefab Catalog
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="prefabSearch"
              placeholder="Search by name, ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 h-10"
            />
          </div>
        </div>

        {/* Catalog Results */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-bold">
            Catalog ({filteredCatalog.length} prefabs)
          </Label>
          <ScrollArea className="h-[200px] border-2 rounded-lg p-2">
            {catalogLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-xs">Loading catalog...</p>
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-xs">No prefabs found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCatalog.map((prefab) => (
                  <div
                    key={prefab.id}
                    className="p-2 bg-muted/50 rounded border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{prefab.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {prefab.id}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddPrefab(prefab.id, prefab.name)}
                        disabled={isAdding}
                        className="h-7 px-2 text-xs font-bold shrink-0"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    {prefab.category && (
                      <Badge variant="outline" className="text-xs">
                        {prefab.category}
                      </Badge>
                    )}
                    {prefab.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {prefab.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Prefab Spawn List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base font-bold">
              Spawn List ({prefabs.length})
            </Label>
            {prefabs.length > 0 && (
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
          
          <ScrollArea className="h-[150px] border-2 rounded-lg p-2">
            {prefabs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-xs">No prefabs in spawn list</p>
                <p className="text-xs mt-1">Add prefabs from catalog above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {prefabs.map((prefab, index) => (
                  <div
                    key={`${prefab.prefabId}-${index}`}
                    className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{prefab.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {prefab.prefabId}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSpawnPrefab(prefab.name, prefab.prefabId)}
                      className="h-8 px-3 text-xs font-bold shrink-0"
                    >
                      Spawn
                    </Button>
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
          <ScrollArea className="h-[120px] border-2 rounded-lg p-2 bg-muted/20">
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
