import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './useQueries';
import type { ModSettings as BackendModSettings } from '../backend';

export interface ModSettings {
  fly: boolean;
  superSpeed: boolean;
  speedMultiplier: number;
  superJump: boolean;
  jumpMultiplier: number;
  disableMonsters: boolean;
  rainbowBackground: boolean;
}

const DEFAULT_SETTINGS: ModSettings = {
  fly: false,
  superSpeed: false,
  speedMultiplier: 1,
  superJump: false,
  jumpMultiplier: 1,
  disableMonsters: false,
  rainbowBackground: false,
};

// Map backend fields to frontend settings
function backendToFrontend(backend: BackendModSettings): Partial<ModSettings> {
  return {
    fly: backend.noclipEnabled,
    superSpeed: backend.infiniteManaEnabled,
    superJump: backend.moonJumpEnabled,
    disableMonsters: backend.infiniteHealthEnabled,
  };
}

function frontendToBackend(frontend: ModSettings): BackendModSettings {
  return {
    noclipEnabled: frontend.fly,
    infiniteManaEnabled: frontend.superSpeed,
    moonJumpEnabled: frontend.superJump,
    infiniteHealthEnabled: frontend.disableMonsters,
  };
}

export function useModSettings() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();
  const [settings, setSettings] = useState<ModSettings>(DEFAULT_SETTINGS);

  // Load settings from backend when profile is available
  useEffect(() => {
    if (userProfile) {
      const backendSettings = backendToFrontend(userProfile.modSettings);
      // Load client-side settings from localStorage
      const stored = localStorage.getItem('modSettings');
      const clientSettings = stored ? JSON.parse(stored) : {};
      
      setSettings({
        ...DEFAULT_SETTINGS,
        ...backendSettings,
        speedMultiplier: clientSettings.speedMultiplier || 1,
        jumpMultiplier: clientSettings.jumpMultiplier || 1,
        rainbowBackground: clientSettings.rainbowBackground || false,
      });
    }
  }, [userProfile]);

  const updateSettings = async (updates: Partial<ModSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Save to localStorage for client-only settings
    localStorage.setItem('modSettings', JSON.stringify({
      speedMultiplier: newSettings.speedMultiplier,
      jumpMultiplier: newSettings.jumpMultiplier,
      rainbowBackground: newSettings.rainbowBackground,
    }));

    // Save to backend
    if (userProfile) {
      try {
        await saveProfile({
          ...userProfile,
          modSettings: frontendToBackend(newSettings),
        });
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  };

  return {
    settings,
    updateSettings,
    isLoading,
  };
}
