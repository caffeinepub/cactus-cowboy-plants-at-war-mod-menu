import { useState, useCallback } from 'react';

interface BrowserHistoryState {
  currentUrl: string;
  backStack: string[];
  forwardStack: string[];
}

export function useBrowserHistory() {
  const [state, setState] = useState<BrowserHistoryState>({
    currentUrl: '',
    backStack: [],
    forwardStack: [],
  });

  const go = useCallback((url: string) => {
    setState((prev) => {
      const newBackStack = prev.currentUrl ? [...prev.backStack, prev.currentUrl] : prev.backStack;
      return {
        currentUrl: url,
        backStack: newBackStack,
        forwardStack: [],
      };
    });
  }, []);

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.backStack.length === 0) return prev;
      
      const newBackStack = [...prev.backStack];
      const previousUrl = newBackStack.pop()!;
      
      return {
        currentUrl: previousUrl,
        backStack: newBackStack,
        forwardStack: [prev.currentUrl, ...prev.forwardStack],
      };
    });
  }, []);

  const forward = useCallback(() => {
    setState((prev) => {
      if (prev.forwardStack.length === 0) return prev;
      
      const newForwardStack = [...prev.forwardStack];
      const nextUrl = newForwardStack.shift()!;
      
      return {
        currentUrl: nextUrl,
        backStack: [...prev.backStack, prev.currentUrl],
        forwardStack: newForwardStack,
      };
    });
  }, []);

  const reload = useCallback(() => {
    // Trigger is handled by parent component via key update
  }, []);

  return {
    currentUrl: state.currentUrl,
    canGoBack: state.backStack.length > 0,
    canGoForward: state.forwardStack.length > 0,
    go,
    back,
    forward,
    reload,
  };
}
