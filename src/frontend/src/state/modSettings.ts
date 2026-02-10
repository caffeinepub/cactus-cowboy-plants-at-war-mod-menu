// This file defines the frontend mod settings model and helpers

export interface ModSettings {
  fly: boolean;
  superSpeed: boolean;
  speedMultiplier: number;
  superJump: boolean;
  jumpMultiplier: number;
  disableMonsters: boolean;
  rainbowBackground: boolean;
}

export const DEFAULT_MOD_SETTINGS: ModSettings = {
  fly: false,
  superSpeed: false,
  speedMultiplier: 1,
  superJump: false,
  jumpMultiplier: 1,
  disableMonsters: false,
  rainbowBackground: false,
};

export function clampMultiplier(value: number): number {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function getStoredSettings(): Partial<ModSettings> {
  try {
    const stored = localStorage.getItem('modSettings');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function storeSettings(settings: Partial<ModSettings>): void {
  try {
    localStorage.setItem('modSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to store settings:', error);
  }
}
