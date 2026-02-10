import { useEffect } from 'react';
import { AuthGate } from './components/AuthGate';
import { ModMenuPage } from './pages/ModMenuPage';
import { Toaster } from '@/components/ui/sonner';
import { useModSettings } from './hooks/useModSettings';
import { useRuntimeEnv } from './hooks/useRuntimeEnv';

export default function App() {
  const { settings } = useModSettings();
  const { isQuestBrowser, isVRBrowser } = useRuntimeEnv();

  useEffect(() => {
    // Apply VR-specific marker for styling
    if (isQuestBrowser || isVRBrowser) {
      document.documentElement.setAttribute('data-vr-browser', 'true');
    } else {
      document.documentElement.removeAttribute('data-vr-browser');
    }
  }, [isQuestBrowser, isVRBrowser]);

  return (
    <div className={`min-h-screen ${settings.rainbowBackground ? 'rainbow-bg' : 'desert-bg'}`}>
      <AuthGate>
        <ModMenuPage />
      </AuthGate>
      <Toaster />
    </div>
  );
}
