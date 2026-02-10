import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, RotateCcw, AlertCircle, Smartphone, Info } from 'lucide-react';
import { useAppToAppLink } from '../hooks/useAppToAppLink';
import { useRuntimeEnv } from '../hooks/useRuntimeEnv';
import { toast } from 'sonner';

export function AppToAppLauncherPanel() {
  const { deepLink, setDeepLink, resetToDefault } = useAppToAppLink();
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAndroid, isQuestBrowser } = useRuntimeEnv();

  const handleLaunch = async () => {
    setErrorMessage(null);
    setIsLaunching(true);

    if (!isAndroid) {
      setErrorMessage('App switching is not available in the current environment. This feature requires an Android device or Meta Quest headset.');
      setIsLaunching(false);
      return;
    }

    try {
      // Track visibility change to detect if app switched
      let switched = false;
      const visibilityHandler = () => {
        if (document.hidden) {
          switched = true;
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);

      // Attempt to open the deep link
      window.location.href = deepLink;

      // Wait a moment to see if the app switches
      await new Promise(resolve => setTimeout(resolve, 1500));

      document.removeEventListener('visibilitychange', visibilityHandler);

      if (!switched) {
        if (isQuestBrowser) {
          setErrorMessage('Unable to open the game. Quest Browser may have limitations with deep-link app switching. Consider using the APK/TWA wrapper for better app-to-app functionality, or ensure the game app is installed and the deep link URL is correct.');
        } else {
          setErrorMessage('Unable to open the game. Please ensure the game app is installed on your device and the deep link URL is correct.');
        }
      } else {
        toast.success('Launching game...');
      }
    } catch (error) {
      setErrorMessage('Failed to launch the game. Please check the deep link URL and try again.');
      console.error('Launch error:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <Card className="border-2 border-[oklch(0.45_0.15_45)]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
          <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
          APP LAUNCHER
        </CardTitle>
        <CardDescription>Switch to the game app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAndroid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              App switching is only available on Android devices (including Meta Quest). This feature will not work in the current environment.
            </AlertDescription>
          </Alert>
        )}

        {isQuestBrowser && (
          <Alert className="bg-[oklch(0.65_0.15_45)]/10 border-[oklch(0.65_0.15_45)]">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Quest Browser detected:</strong> Deep-link app switching may have limitations. For best results, use the APK/TWA wrapper or run the web app directly in Quest Browser.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="deepLink" className="text-sm sm:text-base font-bold">
            Deep Link / Intent URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="deepLink"
              value={deepLink}
              onChange={(e) => setDeepLink(e.target.value)}
              placeholder="intent://..."
              className="border-2 font-mono text-xs sm:text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={resetToDefault}
              title="Reset to default"
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure the deep link or intent URL to launch the game app
          </p>
        </div>

        <Button
          onClick={handleLaunch}
          disabled={isLaunching || !deepLink.trim() || !isAndroid}
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold touch-manipulation"
          size="lg"
        >
          {isLaunching ? (
            <>Launching...</>
          ) : (
            <>
              <ExternalLink className="mr-2 h-5 w-5" />
              Open Game
            </>
          )}
        </Button>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">How it works:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Configure the deep link URL for your game app</li>
            <li>Tap "Open Game" to switch to the game</li>
            <li>The mod menu will run in the background</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
