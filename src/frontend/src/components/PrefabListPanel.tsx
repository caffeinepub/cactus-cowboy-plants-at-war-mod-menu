import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePrefabCatalog } from '../hooks/usePrefabCatalog';
import { Search, Copy, Package } from 'lucide-react';
import { toast } from 'sonner';

export function PrefabListPanel() {
  const { data: catalog, isLoading, isError } = usePrefabCatalog();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrefabs = useMemo(() => {
    if (!catalog?.prefabs) return [];
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return catalog.prefabs;

    return catalog.prefabs.filter(
      (prefab) =>
        prefab.name.toLowerCase().includes(query) ||
        prefab.id.toLowerCase().includes(query) ||
        (prefab.category && prefab.category.toLowerCase().includes(query)) ||
        (prefab.description && prefab.description.toLowerCase().includes(query))
    );
  }, [catalog, searchQuery]);

  const handleCopy = (prefabId: string) => {
    navigator.clipboard.writeText(prefabId).then(() => {
      toast.success('Copied to clipboard', {
        description: prefabId,
      });
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-[oklch(0.45_0.15_45)]">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            PREFAB LIST
          </CardTitle>
          <CardDescription>Loading prefab catalog...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Loading prefabs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !catalog) {
    return (
      <Card className="border-2 border-[oklch(0.45_0.15_45)]">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            PREFAB LIST
          </CardTitle>
          <CardDescription>Game prefab catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">
              Prefab catalog not available
            </p>
            <p className="text-xs text-muted-foreground">
              See ANDROID_APK_BUILD.md for build instructions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[oklch(0.45_0.15_45)]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
          <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          PREFAB LIST
        </CardTitle>
        <CardDescription>
          {catalog.prefabs.length} game prefabs available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="prefab-search" className="text-sm sm:text-base font-bold">
            Search Prefabs
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="prefab-search"
              placeholder="Search by name, ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 h-11 sm:h-10"
            />
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="text-xs text-muted-foreground">
            Found {filteredPrefabs.length} of {catalog.prefabs.length} prefabs
          </div>
        )}

        {/* Prefab List */}
        <ScrollArea className="h-[300px] sm:h-[350px] border-2 rounded-lg p-2">
          {filteredPrefabs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-xs sm:text-sm">
                {searchQuery ? 'No prefabs match your search' : 'No prefabs available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPrefabs.map((prefab) => (
                <div
                  key={prefab.id}
                  className="flex items-start justify-between gap-2 p-3 rounded-md border-2 bg-card hover:bg-accent transition-colors touch-manipulation"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base break-words">
                      {prefab.name}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all mt-1">
                      {prefab.id}
                    </div>
                    {prefab.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {prefab.category}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(prefab.id)}
                    className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                    title="Copy prefab ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
