import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, Glasses } from 'lucide-react';
import { ApkBuildInstructionsOverlay } from './ApkBuildInstructionsOverlay';
import { useRuntimeEnv } from '../hooks/useRuntimeEnv';
import { Alert, AlertDescription } from '@/components/ui/alert';

const APK_PATH = '/assets/apk/cactus-cowboy-mod-menu.apk';

export function DownloadsPanel() {
  const [apkAvailable, setApkAvailable] = useState<boolean | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const { isQuestBrowser } = useRuntimeEnv();

  useEffect(() => {
    // Check if APK file exists
    fetch(APK_PATH, { method: 'HEAD' })
      .then((response) => {
        setApkAvailable(response.ok);
      })
      .catch(() => {
        setApkAvailable(false);
      });
  }, []);

  return (
    <>
      <Card className="border-2 border-[oklch(0.45_0.15_45)]">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
            <Download className="h-5 w-5 sm:h-6 sm:w-6" />
            DOWNLOADS
          </CardTitle>
          <CardDescription>Get the Android APK</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meta Quest 3S Guidance */}
          <Alert className="bg-[oklch(0.65_0.15_45)]/10 border-[oklch(0.65_0.15_45)]">
            <Glasses className="h-4 w-4" />
            <AlertDescription className="text-sm space-y-2">
              <p className="font-bold">Meta Quest 3S / Quest Users:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                <li><strong>Quest Browser (Recommended):</strong> Open this web app directly in Quest Browser for instant access</li>
                <li><strong>APK/TWA Option:</strong> Install the Android APK wrapper for a native app experience (requires HTTPS deployment and manifest at /manifest.webmanifest)</li>
              </ul>
              {isQuestBrowser && (
                <p className="text-xs font-medium mt-2 text-[oklch(0.45_0.15_45)]">
                  ✓ Quest Browser detected — you're already running the app!
                </p>
              )}
            </AlertDescription>
          </Alert>

          {apkAvailable === null ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Checking for available downloads...
            </div>
          ) : apkAvailable ? (
            <>
              <div className="bg-[oklch(0.65_0.15_45)] text-white p-4 rounded-lg text-center">
                <Download className="h-8 w-8 mx-auto mb-2" />
                <p className="font-bold text-lg mb-1">APK Available</p>
                <p className="text-sm opacity-90">
                  Download and install on Android devices (including Meta Quest)
                </p>
              </div>
              <Button
                asChild
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold touch-manipulation"
                size="lg"
              >
                <a href={APK_PATH} download="cactus-cowboy-mod-menu.apk">
                  <Download className="mr-2 h-5 w-5" />
                  Download APK
                </a>
              </Button>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>Compatible with Android devices (including Meta Quest)</p>
                <p>Enable "Install from Unknown Sources" in settings</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-bold text-base mb-1">APK Not Available</p>
                <p className="text-sm text-muted-foreground">
                  No pre-built APK is currently available for download.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Build your own APK:</p>
                <Button
                  variant="outline"
                  className="w-full h-11 sm:h-12 touch-manipulation"
                  onClick={() => setShowInstructions(true)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Build Instructions
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">To build the APK:</p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Follow the instructions in the build guide</li>
                  <li>Place the built APK in /assets/apk/</li>
                  <li>The download link will appear automatically</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ApkBuildInstructionsOverlay
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}
