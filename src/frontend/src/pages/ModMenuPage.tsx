import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModStatusBar } from '../components/ModStatusBar';
import { ProcessSelectorPanel } from '../components/ProcessSelectorPanel';
import { PrefabListPanel } from '../components/PrefabListPanel';
import { DownloadsPanel } from '../components/DownloadsPanel';
import { AppToAppLauncherPanel } from '../components/AppToAppLauncherPanel';
import { useModSettings } from '../hooks/useModSettings';
import { useItemSpawner } from '../hooks/useItemSpawner';
import { Trash2, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function ModMenuPage() {
  const { settings, updateSettings, isLoading } = useModSettings();
  const { items, addItem, isAdding, spawnLogs } = useItemSpawner();
  
  const [newItemName, setNewItemName] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    await addItem(newItemName.trim());
    setNewItemName('');
    toast.success(`Added "${newItemName.trim()}" to spawner list`);
  };

  const handleSpawnItem = () => {
    if (selectedItemIndex === null || !items[selectedItemIndex]) {
      toast.error('Please select an item to spawn');
      return;
    }
    
    const item = items[selectedItemIndex];
    toast.success(`Spawned: ${item.name}`, {
      description: `Item spawned at your location`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading Mod Menu...</div>
          <div className="text-muted-foreground">Preparing your arsenal</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <header className="relative overflow-hidden border-b-4 border-[oklch(0.45_0.15_45)]">
        <img 
          src="/assets/generated/mod-menu-banner.dim_1400x400.png" 
          alt="Cactus Cowboy Mod Menu"
          className="w-full h-32 sm:h-40 md:h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
          <div className="container mx-auto px-3 sm:px-4 pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[oklch(0.95_0.05_45)] drop-shadow-lg tracking-tight break-words">
              CACTUS COWBOY MOD MENU
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[oklch(0.85_0.03_45)] mt-1 font-medium">
              Plants at War - Enhanced Edition
            </p>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <ModStatusBar />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Left Column - Movement & Abilities */}
          <div className="space-y-4 sm:space-y-6">
            {/* Mascot */}
            <Card className="border-2 border-[oklch(0.45_0.15_45)] overflow-hidden">
              <img 
                src="/assets/generated/cactus-cowboy-mascot.dim_768x768.png"
                alt="Cactus Cowboy"
                className="w-full h-auto"
              />
            </Card>

            {/* Process Selector */}
            <ProcessSelectorPanel />

            {/* Movement Mods */}
            <Card className="border-2 border-[oklch(0.45_0.15_45)]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                  MOVEMENT MODS
                </CardTitle>
                <CardDescription>Enhance your mobility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Fly */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="fly" className="text-sm sm:text-base font-bold">Fly Mode</Label>
                    <Switch
                      id="fly"
                      checked={settings.fly}
                      onCheckedChange={(checked) => updateSettings({ fly: checked })}
                      className="shrink-0"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Soar through the desert skies
                  </p>
                </div>

                <Separator />

                {/* Super Speed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="speed" className="text-sm sm:text-base font-bold">Super Speed</Label>
                    <Switch
                      id="speed"
                      checked={settings.superSpeed}
                      onCheckedChange={(checked) => updateSettings({ superSpeed: checked })}
                      className="shrink-0"
                    />
                  </div>
                  {settings.superSpeed && (
                    <div className="space-y-2 pl-2 border-l-2 border-[oklch(0.65_0.15_45)]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium">Speed Multiplier</span>
                        <Badge variant="secondary" className="font-mono text-xs sm:text-sm">
                          {settings.speedMultiplier}x
                        </Badge>
                      </div>
                      <Slider
                        value={[settings.speedMultiplier]}
                        onValueChange={([value]) => updateSettings({ speedMultiplier: value })}
                        min={1}
                        max={10}
                        step={1}
                        disabled={!settings.superSpeed}
                        className="cursor-pointer touch-none"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Super Jump */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="jump" className="text-sm sm:text-base font-bold">Super Jump</Label>
                    <Switch
                      id="jump"
                      checked={settings.superJump}
                      onCheckedChange={(checked) => updateSettings({ superJump: checked })}
                      className="shrink-0"
                    />
                  </div>
                  {settings.superJump && (
                    <div className="space-y-2 pl-2 border-l-2 border-[oklch(0.65_0.15_45)]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-medium">Jump Multiplier</span>
                        <Badge variant="secondary" className="font-mono text-xs sm:text-sm">
                          {settings.jumpMultiplier}x
                        </Badge>
                      </div>
                      <Slider
                        value={[settings.jumpMultiplier]}
                        onValueChange={([value]) => updateSettings({ jumpMultiplier: value })}
                        min={1}
                        max={10}
                        step={1}
                        disabled={!settings.superJump}
                        className="cursor-pointer touch-none"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Item Spawner & Prefabs */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-[oklch(0.45_0.15_45)]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                  ITEM SPAWNER
                </CardTitle>
                <CardDescription>Create and spawn custom items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Item Form */}
                <div className="space-y-2">
                  <Label htmlFor="newItem" className="text-sm sm:text-base font-bold">Add New Item</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="newItem"
                      placeholder="Enter item name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddItem();
                        }
                      }}
                      className="border-2 h-11 sm:h-10"
                    />
                    <Button
                      onClick={handleAddItem}
                      disabled={isAdding || !newItemName.trim()}
                      size="icon"
                      className="shrink-0 h-11 w-11 sm:h-10 sm:w-10"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Item List */}
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-bold">Your Items ({items.length})</Label>
                  <ScrollArea className="h-[250px] sm:h-[300px] border-2 rounded-lg p-2">
                    {items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-xs sm:text-sm">No items yet</p>
                        <p className="text-xs mt-1">Add your first item above</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-md border-2 cursor-pointer transition-colors touch-manipulation ${
                              selectedItemIndex === index
                                ? 'bg-[oklch(0.65_0.15_45)] border-[oklch(0.45_0.15_45)] text-white'
                                : 'bg-card hover:bg-accent border-border'
                            }`}
                            onClick={() => setSelectedItemIndex(index)}
                          >
                            <span className="font-medium text-sm sm:text-base break-all pr-2">{item.name}</span>
                            <Badge variant="outline" className="font-mono text-xs shrink-0">
                              #{item.typeId}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <Button
                  onClick={handleSpawnItem}
                  disabled={selectedItemIndex === null}
                  className="w-full h-11 sm:h-12 text-base font-bold touch-manipulation"
                  size="lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Spawn Selected Item
                </Button>

                {/* Spawn Log */}
                {spawnLogs.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-bold text-muted-foreground">
                      Recent Spawns
                    </Label>
                    <ScrollArea className="h-[100px] border rounded-lg p-2 bg-muted/30">
                      <div className="space-y-1 text-xs">
                        {spawnLogs.slice(-5).reverse().map((log, index) => (
                          <div key={index} className="text-muted-foreground">
                            {log}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prefab Catalog */}
            <PrefabListPanel />
          </div>

          {/* Right Column - Game Mods & Downloads */}
          <div className="space-y-4 sm:space-y-6">
            {/* Game Mods */}
            <Card className="border-2 border-[oklch(0.45_0.15_45)]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                  GAME MODS
                </CardTitle>
                <CardDescription>Modify game mechanics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Disable Monsters */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="monsters" className="text-sm sm:text-base font-bold">Disable Monsters</Label>
                    <Switch
                      id="monsters"
                      checked={settings.disableMonsters}
                      onCheckedChange={(checked) => updateSettings({ disableMonsters: checked })}
                      className="shrink-0"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Remove all hostile enemies
                  </p>
                </div>

                <Separator />

                {/* Rainbow Background */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="rainbow" className="text-sm sm:text-base font-bold">Rainbow Background</Label>
                    <Switch
                      id="rainbow"
                      checked={settings.rainbowBackground}
                      onCheckedChange={(checked) => updateSettings({ rainbowBackground: checked })}
                      className="shrink-0"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Psychedelic visual effects
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* App Launcher */}
            <AppToAppLauncherPanel />

            {/* Downloads */}
            <DownloadsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-muted/30">
        <div className="container mx-auto px-3 sm:px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'cactus-cowboy-mod-menu'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
