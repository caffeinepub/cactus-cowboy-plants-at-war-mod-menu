import { Badge } from '@/components/ui/badge';
import { useModSettings } from '../hooks/useModSettings';
import { Plane, Zap, ArrowUp, Ghost, Rainbow } from 'lucide-react';

export function ModStatusBar() {
  const { settings } = useModSettings();

  const activeModsCount = [
    settings.fly,
    settings.superSpeed,
    settings.superJump,
    settings.disableMonsters,
    settings.rainbowBackground,
  ].filter(Boolean).length;

  return (
    <div className="bg-card border-b-2 border-[oklch(0.45_0.15_45)] py-3 sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-muted-foreground">
            ACTIVE MODS ({activeModsCount}):
          </span>
          
          {settings.fly && (
            <Badge variant="default" className="font-bold">
              <Plane className="mr-1 h-3 w-3" />
              FLY
            </Badge>
          )}
          
          {settings.superSpeed && (
            <Badge variant="default" className="font-bold">
              <Zap className="mr-1 h-3 w-3" />
              SPEED {settings.speedMultiplier}x
            </Badge>
          )}
          
          {settings.superJump && (
            <Badge variant="default" className="font-bold">
              <ArrowUp className="mr-1 h-3 w-3" />
              JUMP {settings.jumpMultiplier}x
            </Badge>
          )}
          
          {settings.disableMonsters && (
            <Badge variant="secondary" className="font-bold">
              <Ghost className="mr-1 h-3 w-3" />
              NO MONSTERS
            </Badge>
          )}
          
          {settings.rainbowBackground && (
            <Badge variant="secondary" className="font-bold">
              <Rainbow className="mr-1 h-3 w-3" />
              RAINBOW
            </Badge>
          )}

          {activeModsCount === 0 && (
            <span className="text-sm text-muted-foreground italic">
              No mods active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
