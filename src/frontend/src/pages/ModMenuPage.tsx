import { ModStatusBar } from '../components/ModStatusBar';
import { ProcessSelectorPanel } from '../components/ProcessSelectorPanel';
import { ItemSpawnerPanel } from '../components/ItemSpawnerPanel';
import { PrefabSpawnerPanel } from '../components/PrefabSpawnerPanel';
import { useModSettings } from '../hooks/useModSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Plane, Zap, ArrowUp, Ghost, Rainbow } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export function ModMenuPage() {
  const { settings, updateSettings, isLoading } = useModSettings();

  const handleSpeedMultiplierChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      updateSettings({ speedMultiplier: num });
    }
  };

  const handleJumpMultiplierChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      updateSettings({ jumpMultiplier: num });
    }
  };

  return (
    <div className={`min-h-screen ${settings.rainbowBackground ? 'rainbow-background' : ''}`}>
      <ModStatusBar />
      
      {/* Hero Section with Cover Image */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <img 
            src="/assets/generated/cactus-cowboy-plants-at-war-cover.dim_1024x1536.png"
            alt="Cactus Cowboy: Plants at War game cover"
            className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-2xl border-4 border-[oklch(0.45_0.15_45)]"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[oklch(0.45_0.15_45)] mt-4 mb-2">
            CACTUS COWBOY: PLANTS AT WAR
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-bold">
            Ultimate Mod Menu
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Process Selector & Movement Mods */}
          <div className="space-y-6">
            <ProcessSelectorPanel />
            
            {/* Movement Mods */}
            <Card className="border-2 border-[oklch(0.45_0.15_45)]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                  MOVEMENT MODS
                </CardTitle>
                <CardDescription>Enhance your cowboy's abilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fly */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fly" className="text-base font-bold flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Fly Mode
                    </Label>
                    <Switch
                      id="fly"
                      checked={settings.fly}
                      onCheckedChange={(checked) => updateSettings({ fly: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable flight mode to soar above the battlefield
                  </p>
                </div>

                {/* Super Speed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="superSpeed" className="text-base font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Super Speed
                    </Label>
                    <Switch
                      id="superSpeed"
                      checked={settings.superSpeed}
                      onCheckedChange={(checked) => updateSettings({ superSpeed: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  {settings.superSpeed && (
                    <div className="space-y-1">
                      <Label htmlFor="speedMultiplier" className="text-sm">
                        Speed Multiplier: {settings.speedMultiplier}x
                      </Label>
                      <Input
                        id="speedMultiplier"
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={settings.speedMultiplier}
                        onChange={(e) => handleSpeedMultiplierChange(e.target.value)}
                        className="border-2 h-10"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Move at lightning speed across the desert
                  </p>
                </div>

                {/* Super Jump */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="superJump" className="text-base font-bold flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Super Jump
                    </Label>
                    <Switch
                      id="superJump"
                      checked={settings.superJump}
                      onCheckedChange={(checked) => updateSettings({ superJump: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  {settings.superJump && (
                    <div className="space-y-1">
                      <Label htmlFor="jumpMultiplier" className="text-sm">
                        Jump Multiplier: {settings.jumpMultiplier}x
                      </Label>
                      <Input
                        id="jumpMultiplier"
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={settings.jumpMultiplier}
                        onChange={(e) => handleJumpMultiplierChange(e.target.value)}
                        className="border-2 h-10"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Leap to incredible heights
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Game Mods */}
            <Card className="border-2 border-[oklch(0.45_0.15_45)]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                  GAME MODS
                </CardTitle>
                <CardDescription>Modify game behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Disable Monsters */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="disableMonsters" className="text-base font-bold flex items-center gap-2">
                      <Ghost className="h-4 w-4" />
                      Disable Monsters
                    </Label>
                    <Switch
                      id="disableMonsters"
                      checked={settings.disableMonsters}
                      onCheckedChange={(checked) => updateSettings({ disableMonsters: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remove all hostile plants from the battlefield
                  </p>
                </div>

                {/* Rainbow Background */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rainbowBackground" className="text-base font-bold flex items-center gap-2">
                      <Rainbow className="h-4 w-4" />
                      Rainbow Background
                    </Label>
                    <Switch
                      id="rainbowBackground"
                      checked={settings.rainbowBackground}
                      onCheckedChange={(checked) => updateSettings({ rainbowBackground: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add a colorful animated background to the mod menu
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Item Spawner */}
          <div className="space-y-6">
            <ItemSpawnerPanel />
          </div>

          {/* Right Column - Prefab Spawner */}
          <div className="space-y-6">
            <PrefabSpawnerPanel />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t-2 border-[oklch(0.45_0.15_45)] text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            © {new Date().getFullYear()} • Built with{' '}
            <SiCaffeine className="h-4 w-4 text-[oklch(0.45_0.15_45)]" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[oklch(0.45_0.15_45)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
