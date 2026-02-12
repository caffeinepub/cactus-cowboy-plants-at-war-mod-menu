import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useUpdateModSettings } from './useQueries';
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

function backendToFrontend(backend: BackendModSettings): Partial<ModSettings> {
  return {
    fly: backend.flyEnabled,
    superSpeed: backend.superSpeedEnabled,
    speedMultiplier: backend.superSpeedMultiplier,
    superJump: backend.superJumpEnabled,
    jumpMultiplier: backend.superJumpMultiplier,
    disableMonsters: backend.disableMonsters,
  };
}

function frontendToBackend(frontend: ModSettings): BackendModSettings {
  return {
    flyEnabled: frontend.fly,
    superSpeedEnabled: frontend.superSpeed,
    superSpeedMultiplier: frontend.speedMultiplier,
    superJumpEnabled: frontend.superJump,
    superJumpMultiplier: frontend.jumpMultiplier,
    disableMonsters: frontend.disableMonsters,
  };
}

export function useModSettings() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { mutateAsync: updateBackendSettings } = useUpdateModSettings();
  const [settings, setSettings] = useState<ModSettings>(DEFAULT_SETTINGS);

  // Load settings from backend when profile is available
  useEffect(() => {
    if (userProfile) {
      const backendSettings = backendToFrontend(userProfile.modSettings);
      const stored = localStorage.getItem('modSettings');
      const clientSettings = stored ? JSON.parse(stored) : {};
      
      setSettings({
        ...DEFAULT_SETTINGS,
        ...backendSettings,
        rainbowBackground: clientSettings.rainbowBackground || false,
      });
    }
  }, [userProfile]);

  const updateSettings = async (updates: Partial<ModSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Save rainbow background to localStorage (frontend-only)
    localStorage.setItem('modSettings', JSON.stringify({
      rainbowBackground: newSettings.rainbowBackground,
    }));

    // Save backend-synced settings
    try {
      await updateBackendSettings(frontendToBackend(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
    isLoading: profileLoading,
  };
}
