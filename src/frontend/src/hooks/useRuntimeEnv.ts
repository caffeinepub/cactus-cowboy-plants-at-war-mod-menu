import { useEffect, useState } from 'react';

export interface RuntimeEnvironment {
  isAndroid: boolean;
  isQuestBrowser: boolean;
  isVRBrowser: boolean;
  userAgent: string;
}

export function useRuntimeEnv(): RuntimeEnvironment {
  const [env, setEnv] = useState<RuntimeEnvironment>({
    isAndroid: false,
    isQuestBrowser: false,
    isVRBrowser: false,
    userAgent: '',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isQuestBrowser = /quest/.test(userAgent) || (/android/.test(userAgent) && /oculusbrowser/.test(userAgent));
    const isVRBrowser = isQuestBrowser || /vr/.test(userAgent);

    setEnv({
      isAndroid,
      isQuestBrowser,
      isVRBrowser,
      userAgent: navigator.userAgent,
    });
  }, []);

  return env;
}
