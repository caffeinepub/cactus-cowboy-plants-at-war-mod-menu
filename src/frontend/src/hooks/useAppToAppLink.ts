import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app-to-app-deep-link';
const DEFAULT_DEEP_LINK = 'intent://launch#Intent;scheme=cactusgame;package=com.cactusgame.vr;end';

export function useAppToAppLink() {
  const [deepLink, setDeepLinkState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_DEEP_LINK;
    } catch {
      return DEFAULT_DEEP_LINK;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, deepLink);
    } catch (error) {
      console.error('Failed to save deep link:', error);
    }
  }, [deepLink]);

  const setDeepLink = (value: string) => {
    setDeepLinkState(value);
  };

  const resetToDefault = () => {
    setDeepLinkState(DEFAULT_DEEP_LINK);
  };

  return {
    deepLink,
    setDeepLink,
    resetToDefault,
    defaultDeepLink: DEFAULT_DEEP_LINK,
  };
}
